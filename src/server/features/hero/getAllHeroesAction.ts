'use server';

import { isFailure } from '@/lib/result';
import { getAllHeroes } from './HeroRepository';

export async function getAllHeroesAction() {
  try {
    const result = await getAllHeroes();

    if (isFailure(result)) {
      throw new Error(result.reason);
    }

    return result.data;
  } catch (error) {
    console.error('[getAllHeroesAction]', error);
    throw error;
  }
}
