'use client';

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
          <div className="add">Add</div>
          <div className="add">3dots</div>
        </div>
      </div>
      <div className="md:hidden flex-1">
        <Search />
      </div>
    </section>
  );
}
