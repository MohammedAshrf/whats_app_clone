'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export default function Search() {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="searchbar">
      {focused && (
        <button
          type="button"
          className="focus:outline-none cursor-pointer"
          onClick={() => {
            setFocused(false);
            inputRef.current?.blur();
          }}
        >
          <Image
            src="/assets/left-arrow.svg"
            alt="Back"
            width={20}
            height={20}
          />
        </button>
      )}
      <Image
        src="/assets/search-icon.svg"
        alt="Search"
        width={24}
        height={24}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask Meta AI or search"
        className="focus:outline-none focus:border-transparent"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
