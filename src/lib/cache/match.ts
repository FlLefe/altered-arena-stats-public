import { cache } from 'react';
import { getMatchByIdAction } from '@/server/features/match/getMatchByIdAction';

// Cache for a specific match with its games
export const getCachedMatchById = cache(async (matchId: string) => {
  const result = await getMatchByIdAction({ matchId });
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error || 'Erreur lors du chargement du match');
});

// Cache for match stats (calculated on server)
export const getCachedMatchStats = cache(async (matchId: string) => {
  const match = await getCachedMatchById(matchId);

  if (!match) {
    throw new Error('Match introuvable');
  }

  // Calculate match stats on server
  const gameStats = match.games.reduce(
    (acc, game) => {
      switch (game.gameStatus) {
        case 'WIN':
          acc.wins++;
          break;
        case 'LOSS':
          acc.losses++;
          break;
        case 'DRAW':
          acc.draws++;
          break;
      }
      return acc;
    },
    { wins: 0, losses: 0, draws: 0 },
  );

  return {
    match,
    stats: {
      ...gameStats,
      totalGames: match.games.length,
    },
  };
});
