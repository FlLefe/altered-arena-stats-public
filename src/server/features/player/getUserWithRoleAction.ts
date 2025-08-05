'use server';

import { cookies } from 'next/headers';
import { Result, ResultFailure, ResultSuccess } from '@/lib/result';
import { mapToUserWithRole } from '@/server/features/player/UserWithRoleValue';
import { createClient } from '@/utils/supabase/serverClient';
import { UserWithRoleDTO } from './PlayerDTO';

export const getUserWithRoleAction = async (): Promise<Result<UserWithRoleDTO>> => {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return ResultFailure('not_authenticated');

  const { data, error } = await supabase
    .from('Player')
    .select('alteredAlias, role')
    .eq('authId', user.id)
    .is('deletedAt', null) // Exclude deleted users
    .single();

  if (error || !data) return ResultFailure('not_found');

  const mapped = mapToUserWithRole(data);
  return mapped ? ResultSuccess(mapped) : ResultFailure('invalid_schema');
};
