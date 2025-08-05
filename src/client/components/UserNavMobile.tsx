'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useScrollLock } from '@/client/hooks/useScrollLock';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type User = {
  alteredAlias: string;
  role: 'admin' | 'user';
};

type Props = {
  user: User | null;
};

export function UserNavMobile({ user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useScrollLock(open);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Classes CSS communes pour éviter la duplication
  const navLinkBaseClasses =
    'text-foreground transition-colors py-4 px-6 rounded-lg hover:bg-accent text-xl font-medium block';
  const navLinkActiveClasses = 'text-primary font-semibold bg-accent';
  const buttonBaseClasses =
    'bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-xl rounded-full w-14 h-14 transition-all duration-200 hover:scale-105 active:scale-95';

  return (
    <>
      {/* Burger button */}
      <Button
        onClick={() => setOpen(!open)}
        className={cn(buttonBaseClasses, 'fixed bottom-4 right-4 z-40')}
        size="icon"
        aria-label="Menu mobile"
      >
        <Menu size={24} />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          {/* Header with logo and title */}
          <div className="flex items-center justify-center gap-3 py-8 px-6 border-b border-border">
            <Image
              src="/images/Logo.webp"
              alt="Altered Arena Stats Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-primary">Altered Arena Stats</span>
          </div>

          {/* Centered navigation */}
          <nav className="flex-1 flex flex-col justify-center items-center px-6 py-8">
            <div className="space-y-4 text-center">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn(navLinkBaseClasses, isActive('/') && navLinkActiveClasses)}
              >
                Accueil
              </Link>
              <Link
                href="/stats"
                onClick={() => setOpen(false)}
                className={cn(navLinkBaseClasses, isActive('/stats') && navLinkActiveClasses)}
              >
                Statistiques
              </Link>
              {user && (
                <Link
                  href="/dashboard/matches"
                  onClick={() => setOpen(false)}
                  className={cn(
                    navLinkBaseClasses,
                    isActive('/dashboard/matches') && navLinkActiveClasses,
                  )}
                >
                  Mes parties
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className={cn(navLinkBaseClasses, isActive('/admin') && navLinkActiveClasses)}
                >
                  Admin
                </Link>
              )}
              {user ? (
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className={cn(
                    navLinkBaseClasses,
                    isActive('/dashboard/profile') && navLinkActiveClasses,
                  )}
                >
                  {user.alteredAlias}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={cn(navLinkBaseClasses, isActive('/login') && navLinkActiveClasses)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className={cn(
                      navLinkBaseClasses,
                      isActive('/register') && navLinkActiveClasses,
                    )}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Close button at the bottom */}
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => setOpen(false)}
              className={cn(buttonBaseClasses)}
              size="icon"
              aria-label="Fermer le menu"
            >
              <X size={24} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
