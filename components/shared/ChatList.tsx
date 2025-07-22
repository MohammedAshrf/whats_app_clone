'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { chats } from '@/constants';

export default function ChatList({ splitView }: { splitView?: boolean }) {
  const pathname = usePathname();

  return (
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
            <div className="flex flex-col min-w-0">
              <p className="text-white font-medium">{chat.name}</p>
              <p className="text-gray-400 text-sm truncate max-w-xs">
                {chat.lastMessage}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// import { chats } from '@/constants';

// export default function ChatList() {
//   return (
//     <div className="chats">
//       {chats.map((chat) => (
//         <div className="chat" key={chat.id}>
//           <div className="w-12 h-12 aspect-square bg-gray rounded-full"></div>
//           <div className="flex flex-col min-w-0">
//             <p className="text-white">{chat.name}</p>
//             <p className="text-gray-400 text-sm truncate max-w-xs">
//               {chat.lastMessage}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
