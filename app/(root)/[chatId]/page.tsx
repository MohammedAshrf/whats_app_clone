import Chat from '@/components/ui/Chat';
import { chats } from '@/constants';
import { notFound } from 'next/navigation';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;

  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return notFound();

  return <Chat {...chat} />;
}
