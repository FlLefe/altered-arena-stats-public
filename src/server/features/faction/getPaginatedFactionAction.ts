'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { PaginatedFactionDTO } from './FactionDTO';
import { getFactionsBySearch } from './FactionRepository';

type Params = {
  page: number;
  query: string;
};

export async function getPaginatedFactionsAction({ page, query }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const { items, totalPages } = await getFactionsBySearch({ page, query });

    return {
      success: true,
      data: {
        items: PaginatedFactionDTO.array().parse(items),
        totalPages,
      },
    };
  } catch (error) {
    console.error('[getPaginatedFactionsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
