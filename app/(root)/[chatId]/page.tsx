import Chat from '@/components/ui/Chat';
import { chats } from '@/constants';
import { notFound } from 'next/navigation';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return notFound();

  return <Chat {...chat} />;
}
