// import { NextResponse } from 'next/server';
// import { pusherServer } from '@/lib/pusher';

// export async function POST(req: Request) {
//   const { username, message } = await req.json();

//   await pusherServer.trigger('chat-channel', 'new-message', {
//     username,
//     message,
//   });

//   return NextResponse.json({ success: true });
// }

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new NextResponse('chatId is required', { status: 400 });
  }

  const id = parseInt(chatId);

  const messages = await prisma.message.findMany({
    where: { chatId: id },
    orderBy: { sentAt: 'asc' },
    include: {
      sender: true, // assuming there's a sender relation
    },
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { message, chatId } = body;

  if (!message || !chatId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Save message to DB
  const newMessage = await prisma.message.create({
    data: {
      content: message,
      senderId: parseInt(userId),
      chatId,
    },
    include: {
      sender: true,
    },
  });

  // Trigger real-time event
  await pusherServer.trigger(`chat-${chatId}`, 'new-message', newMessage);

  return NextResponse.json({ success: true, message: newMessage });
}
