import { auth } from '@clerk/nextjs/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const formData = await req.formData();
  const socket_id = formData.get('socket_id');
  const channel_name = formData.get('channel_name');

  const authResponse = pusherServer.authorizeChannel(
    socket_id as string,
    channel_name as string,
    {
      user_id: userId,
    },
  );

  return Response.json(authResponse);
}
