'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Search from '../ui/Search';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

export default function Header({ hideSearchbar }: { hideSearchbar: boolean }) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(hideSearchbar, 'hideSearchbar');

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <section className={`header ${hideSearchbar ? 'md:w-[400px]' : 'md:h-20'}`}>
      <div className="header_container">
        <h1 className="text-white text-lg font-semibold md:text-2xl">
          WhatsApp
        </h1>
        <div
          className={`hidden ${
            hideSearchbar ? 'md:hidden' : 'md:block'
          } flex-1`}
        >
          <Search />
        </div>
        <div className="header_actions" ref={menuRef}>
          <button className="md:hidden cursor-pointer" type="button">
            <Image
              src={'assets/camera.svg'}
              width={30}
              height={30}
              alt="Camera"
            />
          </button>
          <button
            className="hidden md:block cursor-pointer"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload file"
          >
            <Image src={'assets/add.svg'} width={24} height={24} alt="Add" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log('Selected file:', file);
                setSelectedFile(file);
              }
            }}
          />
          <button
            className="flex flex-col items-center justify-center h-10 gap-1 cursor-pointer relative"
            type="button"
            aria-label="More options"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full block"></span>
            <span className="w-1.5 h-1.5 bg-white rounded-full block"></span>
            <span className="w-1.5 h-1.5 bg-white rounded-full block"></span>
            {open && (
              <div className="absolute right-0 top-12 min-w-[160px] bg-main border border-gray-700 rounded shadow-lg z-50">
                <ul className="py-2 text-left">
                  <li className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white">
                    New group
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white
                                 lg:hidden"
                  >
                    New community
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white
                                 lg:hidden"
                  >
                    New broadcast
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white
                                 lg:hidden"
                  >
                    Linked devices
                  </li>
                  <li className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white">
                    Starred messages
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white
                                 lg:hidden"
                  >
                    Read all
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white
                                 lg:hidden"
                  >
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white
                                 hidden lg:block"
                  >
                    Selected chats
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-hover-50 cursor-pointer text-white
                                 hidden lg:block"
                  >
                    Log out
                  </li>
                </ul>
              </div>
            )}
          </button>
        </div>
      </div>
      <div className={`${hideSearchbar ? 'md:block' : 'md:hidden'} flex-1`}>
        <Search />
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
      </div>
    </section>
  );
}
