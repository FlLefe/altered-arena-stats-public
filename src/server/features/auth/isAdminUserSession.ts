'use server';

import { isSuccess } from '@/lib/result';
import { getUserWithRoleAction } from '../player';

export async function isAdminSession(): Promise<boolean> {
  const result = await getUserWithRoleAction();

  if (!isSuccess(result)) return false;

  return result.data.role === 'admin';
}
