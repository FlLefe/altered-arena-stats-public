import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClientUserNav, NavigationLinks } from '@/client/components';

export default function Header() {
  return (
    <>
      {/* Desktop only */}
      <header className="hidden md:block w-full border-b border-header-border bg-header shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-primary hover:opacity-80 transition"
          >
            <Image
              src="/images/Logo.webp"
              alt="Altered Arena Stats Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            Altered Arena Stats
          </Link>

          <nav className="flex gap-4 items-center text-sm font-medium">
            <NavigationLinks />
            <ClientUserNav variant="desktop" />
          </nav>
        </div>
      </header>

      {/* Mobile only */}
      <div className="md:hidden">
        <ClientUserNav variant="mobile" />
      </div>
    </>
  );
}
