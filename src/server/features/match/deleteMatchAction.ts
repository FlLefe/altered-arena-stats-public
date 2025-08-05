'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { deleteMatch } from '../game/GameRepository';

type Params = {
  matchId: string;
};

export async function deleteMatchAction({ matchId }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    const result = await deleteMatch(matchId, session.data.id.toString());

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'VALIDATION_ERROR' };
    }

    return { success: true };
  } catch (error) {
    console.error('[deleteMatchAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
