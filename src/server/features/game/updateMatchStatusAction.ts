'use server';

import { type Match } from '@prisma/client';
import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { UpdateMatchStatusDTO } from './GameDTO';
import { updateMatchStatus, getMatchWithGames } from './GameRepository';

type Params = {
  data: unknown;
};

export async function updateMatchStatusAction({ data }: Params) {
  try {
    // 1. Validate authentication
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    const playerData = session.data;

    // 2. Validate data with Zod
    const validationResult = validateWithZodResult(
      UpdateMatchStatusDTO,
      data,
      'updateMatchStatusAction',
    );
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    // 3. Check if match exists and belongs to user
    const matchResult = await getMatchWithGames(validationResult.data.matchId as string);
    if (isFailure(matchResult)) {
      return { success: false, error: 'Match introuvable', code: 'MATCH_NOT_FOUND' };
    }

    const match = (matchResult as { data: Match }).data;
    if (!match || match.playerId?.toString() !== playerData.id.toString()) {
      return { success: false, error: 'Accès non autorisé', code: 'FORBIDDEN' };
    }

    // 4. Update match status
    const result = await updateMatchStatus(
      validationResult.data.matchId as string,
      validationResult.data.status,
    );

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    return { success: true, data: (result as { data: Match }).data };
  } catch (error) {
    // Unexpected error handling
    console.error('[updateMatchStatusAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
