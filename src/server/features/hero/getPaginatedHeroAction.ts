'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { PaginatedHeroDTO } from './HeroDTO';
import { getHeroesBySearch } from './HeroRepository';

type Params = {
  page: number;
  query: string;
};

export async function getPaginatedHeroesAction({ page, query }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const { items, totalPages } = await getHeroesBySearch({ page, query });

    return {
      success: true,
      data: {
        items: PaginatedHeroDTO.array().parse(items),
        totalPages,
      },
    };
  } catch (error) {
    console.error('[getPaginatedHeroesAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
