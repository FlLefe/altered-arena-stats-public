'use server';

import { notFound } from 'next/navigation';
import { isSuccess } from '@/lib/result';
import { getUserWithRoleAction } from '../player';

export async function getUserSession({ adminOnly = false } = {}) {
  const result = await getUserWithRoleAction();

  if (!isSuccess(result)) {
    if (adminOnly) notFound();
    return null;
  }

  if (adminOnly && result.data.role !== 'admin') {
    notFound();
  }

  const { alteredAlias, role } = result.data;
  return { alteredAlias, role };
}
