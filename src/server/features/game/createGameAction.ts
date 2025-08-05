'use server';

import { type Game, type Match } from '@prisma/client';
import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { checkIfMatchFinished, getMatchFinalStatus } from '@/utils/match';
import { CreateGameDTO } from './GameDTO';
import { createGame, getMatchWithGames, updateMatchStatus } from './GameRepository';
import { transformGameToBaseDTO } from './GameValue';

type Params = {
  data: unknown;
};

export async function createGameAction({ data }: Params) {
  try {
    // 1. Validate authentication
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (!session.data) {
      return { success: false, error: 'Utilisateur non trouvé', code: 'USER_NOT_FOUND' };
    }

    const playerData = session.data;

    // 2. Validate data with Zod
    const validationResult = validateWithZodResult(CreateGameDTO, data, 'createGameAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    // 3. Check if match exists and belongs to user
    const matchResult = await getMatchWithGames(validationResult.data.matchId);
    if (isFailure(matchResult)) {
      return { success: false, error: 'Match introuvable', code: 'MATCH_NOT_FOUND' };
    }

    const match = matchResult.data as (Match & { games: Game[] }) | null;
    if (!match || match.playerId?.toString() !== playerData.id.toString()) {
      return { success: false, error: 'Accès non autorisé', code: 'FORBIDDEN' };
    }

    // 4. Check if match is still in progress
    if (match.matchStatus !== 'IN_PROGRESS') {
      return { success: false, error: 'Ce match est déjà terminé', code: 'MATCH_ALREADY_FINISHED' };
    }

    // 5. Create game
    const result = await createGame({
      matchId: validationResult.data.matchId,
      playerHeroId: validationResult.data.playerHeroId as string,
      opponentHeroId: validationResult.data.opponentHeroId as string,
      gameStatus: validationResult.data.gameStatus,
      comment: validationResult.data.comment,
    });

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    // 6. Check if match is now finished and update status if needed
    const updatedMatchResult = await getMatchWithGames(validationResult.data.matchId);
    if (!isFailure(updatedMatchResult)) {
      const updatedMatch = updatedMatchResult.data as (Match & { games: Game[] }) | null;
      if (updatedMatch) {
        const wins = updatedMatch.games.filter((g: Game) => g.gameStatus === 'WIN').length;
        const losses = updatedMatch.games.filter((g: Game) => g.gameStatus === 'LOSS').length;

        if (
          checkIfMatchFinished(updatedMatch.matchFormat, updatedMatch.games.length, wins, losses)
        ) {
          const finalStatus = getMatchFinalStatus(wins, losses);
          await updateMatchStatus(validationResult.data.matchId, finalStatus);
        }
      }
    }

    // 7. Map to DTO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameDTO = transformGameToBaseDTO((result as any).data);

    return { success: true, data: gameDTO };
  } catch (error) {
    // Gestion des erreurs inattendues
    console.error('[createGameAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
