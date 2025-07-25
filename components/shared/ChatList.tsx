'use client';

import detectLanguage from '@/lib/detectLanguage';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { chats } from '@/constants';
import { useEffect, useState } from 'react';

interface Chat {
  id: string;
  firstName: string;
  lastName: string;
  lastMessage: { content: string };
}

export default function ChatList({ splitView }: { splitView?: boolean }) {
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setChats(data.users);
        // console.log(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // console.log('chats:', chats);

  if (loading) return <div>Loading...</div>;

  // console.log(detectLanguage(chats[0].firstName));

  return (
    // <div>Hi</div>
    <div
      className={`flex flex-col divide-y divide-gray-800 pt-26
    ${splitView ? 'md:pt-24' : 'md:pt-20'} lg:ps-20 lg:pt-20`}
    >
      {chats.map((chat) => {
        const isActive = pathname === `/${chat.id}`;

        return (
          <Link
            href={`/${chat.id}`}
            key={chat.id}
            className={`flex gap-3 items-center p-4 transition-colors duration-200 bg-main
                 hover:bg-gray-800 ${isActive ? 'bg-gray-800' : ''}`}
          >
            {/* Avatar Placeholder */}
            <div className="w-12 h-12 aspect-square bg-gray-500 rounded-full" />

            {/* Name & Last Message */}
            <div className={`flex flex-col min-w-0`}>
              <div
                className={`flex items-center gap-2 ${
                  detectLanguage(chat.firstName) === 'arabic'
                    ? 'flex-row-reverse justify-end'
                    : 'justify-start'
                }`}
              >
                <p className="text-white font-medium">{chat.firstName}</p>
                <p className="text-white font-medium">{chat.lastName}</p>
              </div>
              <p className="text-gray-400 text-sm truncate max-w-xs">
                {chat.lastMessage
                  ? chat.lastMessage.content
                  : 'no messages yet'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
