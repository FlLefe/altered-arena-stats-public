'use server';

import { revalidateSeasons } from '@/lib/cache/revalidation';
import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { UpdateSeasonDTO } from '@/server/features/season/SeasonDTO';
import { updateSeason } from '@/server/features/season/SeasonRepository';

type Params = {
  id: string;
  data: unknown;
};

export async function updateSeasonAction({ id, data }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const validationResult = validateWithZodResult(UpdateSeasonDTO, data, 'updateSeasonAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await updateSeason({ id, data: validationResult.data });

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    // Revalidate the seasons cache
    revalidateSeasons();

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[updateSeasonAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
