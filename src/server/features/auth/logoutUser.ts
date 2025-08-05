'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/serverClient';

export async function logoutUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();
}
