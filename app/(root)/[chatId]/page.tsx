// import Chat from '@/components/ui/Chat';
// import { chats } from '@/constants';
// import { notFound } from 'next/navigation';

// export default async function ChatPage({
//   params,
// }: {
//   params: { chatId: string };
// }) {
//   const { chatId } = params;

//   const chat = chats.find((c) => c.id === chatId);
//   if (!chat) return notFound();

//   return <Chat {...chat} />;
// }

// app/(root)/[chatId]/page.tsx

// export default async function ChatPage({
//   params,
// }: {
//   params: { chatId: string };
// }) {
//   return <div>Chat ID: {params.chatId}</div>;
// }

export default async function ChatPage() {
  return <div>Chat ID: {'chatId'}</div>;
}
