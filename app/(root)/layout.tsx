'use client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Bottombar from '@/components/shared/Bottombar';
import Header from '@/components/shared/Header';
import Leftbar from '@/components/shared/Leftbar';
import ChatList from '@/components/shared/ChatList'; // adjust path if needed
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// export const metadata: Metadata = {
//   title: 'WhatsApp Clone',
//   description: 'A responsive messaging UI',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = /^\/[^\/]+$/.test(pathname) && pathname !== '/';
  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showSplitView = isChatPage && !isMobile;
  const hideHeader = isChatPage && isMobile;

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body
          className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {isAuthPage ? (
            children // Only render Clerk's auth page
          ) : (
            <section className="main_container">
              <Leftbar />
              <div className="flex flex-col flex-1 min-h-0">
                {!hideHeader && <Header hideSearchbar={showSplitView} />}
                {showSplitView ? (
                  <div className="flex flex-1">
                    <div
                      className={`scrollbar-custom fixed w-[400px] lg:w-[480px] border-r overflow-y-auto h-full
                  ${showSplitView ? 'md:mt-[14px] lg:mt-[30px]' : ''} lg:block`}
                    >
                      <ChatList splitView={showSplitView} />{' '}
                      {/* manual render of chat list on desktop */}
                    </div>

                    <div
                      className="w-[calc(100%-400px)] ms-[400px] overflow-y-auto h-full
                   lg:w-[calc(100%-480px)] lg:ms-[480px]"
                    >
                      {children} {/* the chat view */}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
                      <SignedOut>
                        <SignInButton />
                        <SignUpButton>
                          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                          </button>
                        </SignUpButton>
                      </SignedOut>
                      <SignedIn>
                        <UserButton />
                      </SignedIn>
                    </header> */}
                    {children}{' '}
                    {/* either main chat list (/) or full-screen chat (on mobile) */}
                  </div>
                )}
              </div>
              <Bottombar />
            </section>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
