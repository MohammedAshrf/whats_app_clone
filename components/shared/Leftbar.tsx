'use client';

import { mainBarLinks } from '@/constants';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Bottombar() {
  const pathname = usePathname();

  return (
    <section className="leftbar">
      {/* <div className="flex flex-col h-full justify-between"> */}
      <div className="leftbar_container">
        <div>
          {mainBarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <Link
                className={`flex w-fit flex-col items-center gap-2 p-2 curser-pointer`}
                href={link.route}
                key={link.label}
              >
                <div
                  className={`flex items-center justify-center cursor-pointer ${
                    isActive ? 'bg-green-50 rounded-4xl' : ''
                  } w-12 h-9`}
                >
                  <Image
                    src={link.iconURL}
                    alt={link.label}
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-sm font-semibold text-white lg:hidden">
                  {link.label.split(/\s+/)[0]}
                </p>
              </Link>
            );
          })}
          <div className="w-14 border-b border-hover-100" />
          <div className="flex items-center justify-center cursor-pointer pt-4">
            <Image
              src="/assets/Meta_AI_icon.png"
              alt="meta-ai-icon"
              width={28}
              height={28}
            />
          </div>
        </div>

        {/* User Button */}
        <div className="pb-4">
          <UserButton />
        </div>
      </div>
      {/* </div> */}
    </section>
  );
}
