export const formatMatchFormat = (format: string): string => {
  const formatMap: Record<string, string> = {
    BO1: 'Best of 1',
    BO3: 'Best of 3',
    BO5: 'Best of 5',
    BO7: 'Best of 7',
    BO9: 'Best of 9',
  };
  return formatMap[format] || format;
};

export const formatGameStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    WIN: 'Victoire',
    LOSS: 'Défaite',
    DRAW: 'Égalité',
  };
  return statusMap[status] || status;
};

export const getMaxGamesForFormat = (format: string): number => {
  const formatMap: Record<string, number> = {
    BO1: 1,
    BO3: 3,
    BO5: 5,
    BO7: 7,
    BO9: 9,
  };
  return formatMap[format] || 1;
};

export const getCurrentGameNumber = (totalGames: number): number => {
  return totalGames + 1;
};

export const checkIfMatchFinished = (
  format: string,
  gamesCount: number,
  wins: number,
  losses: number,
): boolean => {
  const formatMap: Record<string, number> = {
    BO1: 1,
    BO3: 2,
    BO5: 3,
    BO7: 4,
    BO9: 5,
  };

  const requiredWins = formatMap[format] || 1;
  const maxGames = formatMap[format] * 2 - 1;

  return wins >= requiredWins || losses >= requiredWins || gamesCount >= maxGames;
};

export const getMatchFinalStatus = (wins: number, losses: number): 'WIN' | 'LOSS' | 'DRAW' => {
  if (wins > losses) {
    return 'WIN';
  } else if (losses > wins) {
    return 'LOSS';
  } else {
    return 'DRAW';
  }
};
