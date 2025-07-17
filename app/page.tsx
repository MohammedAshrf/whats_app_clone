import { chats } from '@/constants';

export default function Chats() {
  return (
    <div className="chats">
      {chats.map((chat) => (
        <div className="chat" key={chat.id}>
          <div className="w-12 h-12 aspect-square bg-gray rounded-full"></div>
          <div className="flex flex-col min-w-0">
            <p className="text-white">{chat.name}</p>
            <p className="text-gray-400 text-sm truncate max-w-xs">
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
