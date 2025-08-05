'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { getMatchWithGames } from '../game/GameRepository';
import { transformMatchToMatchWithGames } from './MatchValue';

type Params = {
  matchId: string;
};

export async function getMatchByIdAction({ matchId }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    const playerData = session.data;

    const result = await getMatchWithGames(matchId);
    if (isFailure(result)) {
      return { success: false, error: 'Match introuvable', code: 'NOT_FOUND' };
    }

    const match = result.data;
    if (!match) {
      return { success: false, error: 'Match introuvable', code: 'NOT_FOUND' };
    }

    if (match.playerId?.toString() !== playerData.id.toString().toString()) {
      return { success: false, error: 'Accès non autorisé', code: 'FORBIDDEN' };
    }

    const matchDTO = transformMatchToMatchWithGames(match as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    return { success: true, data: matchDTO };
  } catch (error) {
    console.error('[getMatchByIdAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
