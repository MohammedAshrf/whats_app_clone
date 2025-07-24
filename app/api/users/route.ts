import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// adjust if your prisma client is elsewhere
import { auth } from '@clerk/nextjs/server';
// or however you're getting the current user

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth(); // make sure user is signed in
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

    // --- 1. Pinned users ---
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

    // --- 2. Recently chatted users (excluding pinned) ---
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

    const recentUsers = recentChats
      .flatMap((c) => c.participants.map((cp) => cp.user))
      .filter((u) => !pinnedUserIds.includes(u.id));
    const recentUserIds = recentUsers.map((u) => u.id);

    // --- 3. All other users (excluding current, pinned, recent) ---
    const excludedIds = [currentUserId, ...pinnedUserIds, ...recentUserIds];

    const otherUsers = await prisma.user.findMany({
      where: {
        id: { notIn: excludedIds },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // --- Final merged result ---
    const allUsers = [...pinnedUsers, ...recentUsers, ...otherUsers];

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
