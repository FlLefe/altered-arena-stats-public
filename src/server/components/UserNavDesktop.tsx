'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {
  alteredAlias: string;
  isAdmin: boolean;
};

export function UserNavDesktop({ alteredAlias, isAdmin }: Props) {
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
        href="/dashboard/matches"
        className={cn(
          'hover:underline transition-colors',
          isActive('/dashboard/matches') && 'text-primary font-semibold',
        )}
      >
        Mes parties
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            'hover:underline transition-colors',
            isActive('/admin') && 'text-primary font-semibold',
          )}
        >
          Admin
        </Link>
      )}
      <Link
        href="/dashboard/profile"
        className={cn(
          'hover:underline transition-colors',
          isActive('/dashboard/profile') && 'text-primary font-semibold',
        )}
      >
        {alteredAlias}
      </Link>
    </>
  );
}
