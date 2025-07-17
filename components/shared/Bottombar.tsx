'use client';

import { mainBarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Bottombar() {
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {mainBarLinks.map((link) => {
          const isActive = pathname === link.route;

          return (
            <Link
              className={`flex w-fit flex-col items-center gap-2 p-2`}
              href={link.route}
              key={link.label}
            >
              <div
                className={`flex items-center justify-center ${
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
              <p className="text-sm font-semibold text-white">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
