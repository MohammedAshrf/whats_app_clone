'use client';

import Image from 'next/image';
import Search from './Search';

export default function Header() {
  return (
    <section className="header">
      <div className="header_container">
        <h1 className="text-white text-lg font-semibold md:text-2xl">
          WhatsApp
        </h1>
        <div className="hidden md:block flex-1">
          <Search />
        </div>
        <div className="header_actions">
          <div className="md:hidden">
            <Image
              src={'assets/camera.svg'}
              width={30}
              height={30}
              alt="Camera"
            />
          </div>
          <div className="hidden md:block">
            <Image src={'assets/add.svg'} width={24} height={24} alt="Add" />
          </div>
          <div className="flex flex-col items-center justify-center h-10 gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex-1">
        <Search />
      </div>
    </section>
  );
}
