'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { transformMatchToPaginatedDTO } from '../match/MatchValue';
import { getPaginatedPlayerMatches } from './GameRepository';

type Params = {
  page: number;
  query: string;
};

export async function getPaginatedUserMatchesAction({ page, query }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    const { items, totalPages } = await getPaginatedPlayerMatches({
      playerId: session.data.id.toString(),
      page,
      query,
    });

    return {
      success: true,
      data: {
        items: items.map((item) => transformMatchToPaginatedDTO(item as any)), // eslint-disable-line @typescript-eslint/no-explicit-any
        totalPages,
      },
    };
  } catch (error) {
    console.error('[getPaginatedUserMatchesAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
