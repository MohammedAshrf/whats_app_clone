import Chat from '@/components/ui/Chat';
import { chats } from '@/constants';
import { notFound } from 'next/navigation';

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  console.log(typeof chatId);

  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return notFound();

  return (
    <>
      <Chat {...chat} />
    </>
  );
}
