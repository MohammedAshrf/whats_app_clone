'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function Chat(chat: {
  id: string;
  name: string;
  lastMessage: string;
  messages: { fromMe: boolean; text: string }[];
  timestamp: string;
}) {
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe('chat-channel');
    };
  }, []);

  const handleSend = async () => {
    if (!input || !username) return;

    await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({ username, message: input }),
    });

    setInput('');
  };

  return (
    <div className="w-full h-full fixed flex flex-col items-stretch justify-between">
      {/* Header */}
      <div className="fixed flex items-center gap-4 w-full px-4 py-3 border-b border-gray-800 bg-gray-900">
        <div className="w-10 h-10 rounded-full bg-gray-600" />
        <div>
          <p className="text-white font-medium">{chat.name}</p>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto pt-20 pb-38 py-2 space-y-3 bg-black
        md:ps-4 md:pe-24"
      >
        {
          // chat.messages?.length > 0 ? (
          //   chat.messages.map((msg, idx) => (
          //     <div
          //       key={idx}
          //       className={`max-w-[300px] px-3 py-2 rounded-lg text-sm ${
          //         msg.fromMe
          //           ? 'bg-green-600 self-end text-white'
          //           : 'bg-gray-700 self-start text-white'
          //       }`}
          //     >
          //       {msg.text}
          //     </div>
          //   ))
          // )

          messages?.length > 0 ? (
            messages.map((msg, i) => {
              const isMe = msg.username === username;

              return (
                <p
                  key={i}
                  className={`max-w-[300px] px-3 py-2 rounded-lg text-sm ${
                    isMe
                      ? 'bg-green-600 self-end text-white'
                      : 'bg-gray-700 self-start text-white'
                  }`}
                >
                  <strong>{msg.username}:</strong> {msg.message}
                </p>
              );
            })
          ) : (
            <p className="text-gray-400 text-center mt-8">No messages yet</p>
          )
        }
      </div>

      {/* Input Area */}
      <div
        className="fixed bottom-0 left-0 w-full p-2 mb-20 border-t border-gray-800 
        bg-gray-900 md:w-[calc(100%-400px)] md:ms-[400px]
        lg:w-[calc(100%-480px)] lg:ms-[480px] lg:mb-0"
      >
        <div className="flex flex-col gap-2">
          {/* username input */}
          <input
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter your username..."
          />

          {/* message input */}
          <input
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white outline-none"
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex-1">
            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
