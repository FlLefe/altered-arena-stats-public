'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NavigationLinks() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <Link
        href="/stats"
        className={cn(
          'hover:underline transition-colors',
          isActive('/stats') && 'text-primary font-semibold',
        )}
      >
        Statistiques
      </Link>
    </>
  );
}
