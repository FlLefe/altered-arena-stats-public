import { z } from 'zod';

// Faction Statistics
export const FactionStatsDTO = z.object({
  factionId: z.string(),
  factionName: z.string(),
  factionColor: z.string(),
  totalGames: z.number(),
  wins: z.number(),
  losses: z.number(),
  draws: z.number(),
  winRate: z.number(),
  tournamentGames: z.number(),
  friendlyGames: z.number(),
});

export const FactionStatsResponseDTO = z.object({
  factions: FactionStatsDTO.array(),
  totalGames: z.number(),
  period: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

// Win Rate Statistics
export const WinRateStatsDTO = z.object({
  heroId: z.string(),
  heroName: z.string(),
  factionName: z.string(),
  factionColor: z.string(),
  totalGames: z.number(),
  wins: z.number(),
  losses: z.number(),
  draws: z.number(),
  winRate: z.number(),
  tournamentWinRate: z.number(),
  friendlyWinRate: z.number(),
});

export const WinRateStatsResponseDTO = z.object({
  heroes: WinRateStatsDTO.array(),
  totalHeroes: z.number(),
  period: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

// Match Type Statistics
export const MatchTypeStatsDTO = z.object({
  matchType: z.enum(['TOURNAMENT', 'FRIENDLY']),
  totalMatches: z.number(),
  totalGames: z.number(),
  averageGamesPerMatch: z.number(),
  winRate: z.number(),
  mostPlayedFormat: z.string(),
  formatBreakdown: z.record(z.string(), z.number()),
});

export const MatchTypeStatsResponseDTO = z.object({
  tournament: MatchTypeStatsDTO,
  friendly: MatchTypeStatsDTO,
  total: z.object({
    matches: z.number(),
    games: z.number(),
    winRate: z.number(),
    uniqueFormatsCount: z.number(),
  }),
});

// Hero Performance Statistics
export const HeroPerformanceDTO = z.object({
  heroId: z.string(),
  heroName: z.string(),
  factionName: z.string(),
  factionColor: z.string(),
  totalGames: z.number(),
  wins: z.number(),
  losses: z.number(),
  draws: z.number(),
  winRate: z.number(),
  popularity: z.number(), // Percentage of total games
  bestMatchup: z
    .object({
      opponentHero: z.string(),
      winRate: z.number(),
    })
    .optional(),
  worstMatchup: z
    .object({
      opponentHero: z.string(),
      winRate: z.number(),
    })
    .optional(),
});

export const HeroPerformanceResponseDTO = z.object({
  heroes: HeroPerformanceDTO.array(),
  totalGames: z.number(),
  period: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

// Filter Parameters
export const StatisticsFiltersDTO = z.object({
  seasonId: z.string().optional(),
  matchType: z.enum(['TOURNAMENT', 'FRIENDLY', 'ALL']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().min(1).max(50).optional(),
});

export type FactionStats = z.infer<typeof FactionStatsDTO>;
export type WinRateStats = z.infer<typeof WinRateStatsDTO>;
export type MatchTypeStats = z.infer<typeof MatchTypeStatsDTO>;
export type HeroPerformance = z.infer<typeof HeroPerformanceDTO>;
export type StatisticsFilters = z.infer<typeof StatisticsFiltersDTO>;
