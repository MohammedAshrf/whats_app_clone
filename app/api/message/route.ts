import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  const { username, message } = await req.json();

  await pusherServer.trigger('chat-channel', 'new-message', {
    username,
    message,
  });

  return NextResponse.json({ success: true });
}
