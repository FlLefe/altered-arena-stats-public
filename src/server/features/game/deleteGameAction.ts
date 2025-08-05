'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { deleteGame } from './GameRepository';

type Params = {
  gameId: string;
};

export async function deleteGameAction({ gameId }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    const result = await deleteGame(gameId, session.data.id.toString());

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'VALIDATION_ERROR' };
    }

    return { success: true };
  } catch (error) {
    console.error('[deleteGameAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
