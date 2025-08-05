'use server';

import { cookies } from 'next/headers';
import { ResultFailure } from '@/lib/result';
import { createClient } from '@/utils/supabase/serverClient';

export const getUserProfileStatus = async () => {
  const supabase = createClient(await cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return ResultFailure('not_authenticated');

  // Use Supabase directly instead of PrismaClient
  const { data: player, error } = await supabase
    .from('Player')
    .select('profileComplete')
    .eq('authId', user.id)
    .is('deletedAt', null)
    .single();

  if (error || !player) {
    return ResultFailure('player_not_found');
  }

  return {
    type: 'success' as const,
    data: {
      profileComplete: player.profileComplete,
    },
  };
};
