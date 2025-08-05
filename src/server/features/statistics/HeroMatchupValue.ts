import { HeroMatchupStats } from './HeroMatchupDTO';

// Type for the raw data from the database
export type RawHeroMatchupData = {
  heroId: string;
  heroName: string;
  factionColor: string;
  factionName: string;
  totalGames: number;
  winRate: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  bestMatchups?: Array<{
    opponentHeroId: string;
    opponentHeroName: string;
    opponentFactionColor: string;
    opponentFactionName: string;
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  }>;
  worstMatchups?: Array<{
    opponentHeroId: string;
    opponentHeroName: string;
    opponentFactionColor: string;
    opponentFactionName: string;
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  }>;
};

// Type for the final response
export type HeroMatchupResponse = {
  heroMatchups: HeroMatchupStats[];
  totalHeroes: number;
  period: {
    startDate?: string;
    endDate?: string;
  };
};

// Transform the raw data of rivalries to the final format
export function transformHeroMatchupData(
  rawData: RawHeroMatchupData[],
  filters: { startDate?: string; endDate?: string },
): HeroMatchupResponse {
  const transformedMatchups = rawData.map((matchup) => ({
    heroId: matchup.heroId,
    heroName: matchup.heroName,
    factionColor: matchup.factionColor,
    factionName: matchup.factionName,
    totalGames: matchup.totalGames,
    winRate: matchup.winRate,
    totalWins: matchup.totalWins,
    totalLosses: matchup.totalLosses,
    totalDraws: matchup.totalDraws,
    bestMatchups: matchup.bestMatchups || [],
    worstMatchups: matchup.worstMatchups || [],
  }));

  return {
    heroMatchups: transformedMatchups,
    totalHeroes: transformedMatchups.length,
    period: {
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
  };
}
