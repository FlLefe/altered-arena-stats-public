'use client';

import React from 'react';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/server/features';
import { createClient } from '@/utils/supabase/browserClient';
import { useUserSession } from '../features/session';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const { setUser } = useUserSession();

  const handleLogout = async () => {
    await logoutUser(); // server-side
    await supabase.auth.signOut(); // client-side

    setUser(null); // Update the user state in the context

    startTransition(() => {
      router.refresh();
      router.push('/');
    });
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Se déconnecter
    </Button>
  );
}
