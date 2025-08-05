'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserSession } from '@/client/features/session/useSession';
import { cn } from '@/lib/utils';
import { UserNavDesktop } from '@/server/components';
import { UserNavMobile } from './UserNavMobile';

type Props = {
  variant: 'mobile' | 'desktop';
};

export function ClientUserNav({ variant }: Props) {
  const { user } = useUserSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  if (variant === 'mobile') {
    return <UserNavMobile data-testid="client-user-nav-mobile" user={user} />;
  }

  if (!user) {
    return (
      <div className="flex gap-4">
        <Link
          href="/login"
          className={cn(
            'hover:underline transition-colors',
            isActive('/login') && 'text-primary font-semibold',
          )}
        >
          Connexion
        </Link>
        <Link
          href="/register"
          className={cn(
            'hover:underline transition-colors',
            isActive('/register') && 'text-primary font-semibold',
          )}
        >
          Inscription
        </Link>
      </div>
    );
  }

  return (
    <UserNavDesktop
      data-testid="client-user-nav-desktop"
      alteredAlias={user.alteredAlias}
      isAdmin={user.role === 'admin'}
    />
  );
}
