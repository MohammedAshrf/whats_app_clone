import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUserId = user.id;
    const page = Number(req.nextUrl.searchParams.get('page') || 1);
    const pageSize = 10;

    // 1. Pinned users
    const pinnedChats = await prisma.pinnedChat.findMany({
      where: { userId: currentUserId },
      orderBy: { pinnedAt: 'desc' },
      include: {
        chat: {
          include: {
            participants: {
              where: { userId: { not: currentUserId } },
              include: { user: true },
            },
          },
        },
      },
    });

    const pinnedUsers = pinnedChats.flatMap((p) =>
      p.chat.participants.map((cp) => cp.user),
    );
    const pinnedUserIds = pinnedUsers.map((u) => u.id);

    // 2. Recently chatted users
    const chatParticipantEntries = await prisma.chatParticipant.findMany({
      where: {
        userId: currentUserId,
        chatId: { notIn: pinnedChats.map((p) => p.chatId) },
      },
    });

    const recentChats = await prisma.chat.findMany({
      where: {
        id: {
          in: chatParticipantEntries.map((cp) => cp.chatId),
        },
      },
      include: {
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1,
          include: { sender: true }, // 🆕 include sender to identify user
        },
        participants: {
          where: { userId: { not: currentUserId } },
          include: { user: true },
        },
      },
      orderBy: {
        messages: {
          _count: 'desc',
        },
      },
    });

    const recentUsers: any[] = [];

    for (const chat of recentChats) {
      const otherUser = chat.participants[0]?.user;
      const lastMessage = chat.messages[0] || null;

      if (otherUser && !pinnedUserIds.includes(otherUser.id)) {
        recentUsers.push({
          ...otherUser,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                sentAt: lastMessage.sentAt,
                senderId: lastMessage.senderId,
              }
            : null,
        });
      }
    }

    const recentUserIds = recentUsers.map((u) => u.id);
    const excludedIds = [currentUserId, ...pinnedUserIds, ...recentUserIds];

    // 3. Other users (no recent or pinned)
    const otherUsersRaw = await prisma.user.findMany({
      where: {
        id: { notIn: excludedIds },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 🆕 Add `lastMessage: null` to other users
    const otherUsers = otherUsersRaw.map((user) => ({
      ...user,
      lastMessage: null,
    }));

    // 🆕 Add `lastMessage: null` to pinned users
    const pinnedUsersWithNull = pinnedUsers.map((user) => ({
      ...user,
      lastMessage: null,
    }));

    // 4. Final merged result
    const allUsers = [...pinnedUsersWithNull, ...recentUsers, ...otherUsers];

    return NextResponse.json({
      users: allUsers,
      page,
      hasMore: otherUsers.length === pageSize,
    });
  } catch (err) {
    console.error('[GET_USERS]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
