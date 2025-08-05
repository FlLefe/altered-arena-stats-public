'use server';

import { isFailure } from '@/lib/result';
import { getAllFactions } from './FactionRepository';

export async function getAllFactionsAction() {
  try {
    const result = await getAllFactions();

    if (isFailure(result)) {
      throw new Error(result.reason);
    }

    return result.data;
  } catch (error) {
    console.error('[getAllFactionsAction]', error);
    throw error;
  }
}
