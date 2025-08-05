'use server';

import { cookies } from 'next/headers';
import { ResultFailure, ResultSuccess } from '@/lib/result';
import { getPlayerByAuthId } from '@/server/features/player/PlayerRepository';
import { createClient } from '@/utils/supabase/serverClient';

export const getFullUserSession = async () => {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return ResultFailure('not_authenticated');

  const result = await getPlayerByAuthId(user.id);

  // If the request failed, return the failure
  if (result.type === 'failure') {
    return result;
  }

  // If the request succeeded but no player was found, it's a failure
  if (!result.data) {
    return ResultFailure('player_not_found');
  }

  // At this point, result.data is guaranteed to be non-null
  return ResultSuccess(result.data);
};
