'use server';

import { revalidateSeasons } from '@/lib/cache/revalidation';
import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { deleteSeason } from './SeasonRepository';

type Params = {
  id: string;
};

export async function deleteSeasonAction({ id }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const result = await deleteSeason(id);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    // Revalidate the seasons cache
    revalidateSeasons();

    return { success: true };
  } catch (error) {
    console.error('[deleteSeasonAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
