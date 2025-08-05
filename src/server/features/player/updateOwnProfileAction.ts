'use server';

import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { UpdatePlayerProfileDTO } from './PlayerDTO';
import { updatePlayerProfile } from './PlayerRepository';

type Params = {
  data: unknown;
};

export async function updateOwnProfileAction({ data }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    const validationResult = validateWithZodResult(
      UpdatePlayerProfileDTO,
      data,
      'updateOwnProfileAction',
    );
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await updatePlayerProfile(session.data.authId, validationResult.data);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[updateOwnProfileAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
