'use server';

import { isFailure } from '@/lib/result';
import { getAllSeasons } from './SeasonRepository';

export async function getAllSeasonsAction() {
  try {
    const result = await getAllSeasons();

    if (isFailure(result)) {
      throw new Error(result.reason);
    }

    return result.data;
  } catch (error) {
    console.error('[getAllSeasonsAction]', error);
    throw error;
  }
}
