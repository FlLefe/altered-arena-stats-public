'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { PaginatedPlayerDTO } from './PlayerDTO';
import { getPlayersBySearch } from './PlayerRepository';

type Params = {
  page: number;
  query: string;
  roleFilter?: string;
  factionFilter?: string;
  heroFilter?: string;
};

export async function getPaginatedPlayersAction({
  page,
  query,
  roleFilter,
  factionFilter,
  heroFilter,
}: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const { items, totalPages } = await getPlayersBySearch({
      page,
      query,
      roleFilter,
      factionFilter,
      heroFilter,
    });

    return {
      success: true,
      data: {
        items: PaginatedPlayerDTO.array().parse(items),
        totalPages,
      },
    };
  } catch (error) {
    console.error('[getPaginatedPlayersAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
