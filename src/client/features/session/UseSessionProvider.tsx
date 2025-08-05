'use client';

import React, { createContext, useEffect, useState, startTransition } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { getUserSession } from '@/server/features';
import { type SessionUser } from '@/types/session';

type SessionContextType = {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
};

export const SessionContext = createContext<SessionContextType>({
  user: null,
  setUser: () => {},
});

export function UserSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    startTransition(() => {
      getUserSession().then(setUser);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN') {
        getUserSession().then(setUser);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>;
}
