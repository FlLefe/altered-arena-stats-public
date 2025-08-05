import { z } from 'zod';

// Hero matchup statistics
export const HeroMatchupStatsDTO = z.object({
  heroId: z.string(),
  heroName: z.string(),
  factionColor: z.string(),
  factionName: z.string(),
  totalGames: z.number(),
  winRate: z.number(),
  totalWins: z.number(),
  totalLosses: z.number(),
  totalDraws: z.number(),
  bestMatchups: z.array(
    z.object({
      opponentHeroId: z.string(),
      opponentHeroName: z.string(),
      opponentFactionColor: z.string(),
      opponentFactionName: z.string(),
      gamesPlayed: z.number(),
      wins: z.number(),
      losses: z.number(),
      draws: z.number(),
      winRate: z.number(),
    }),
  ),
  worstMatchups: z.array(
    z.object({
      opponentHeroId: z.string(),
      opponentHeroName: z.string(),
      opponentFactionColor: z.string(),
      opponentFactionName: z.string(),
      gamesPlayed: z.number(),
      wins: z.number(),
      losses: z.number(),
      draws: z.number(),
      winRate: z.number(),
    }),
  ),
});

// Complete response for matchups
export const HeroMatchupsResponseDTO = z.object({
  heroMatchups: z.array(HeroMatchupStatsDTO),
});

export type HeroMatchupStats = z.infer<typeof HeroMatchupStatsDTO>;
export type HeroMatchupsResponse = z.infer<typeof HeroMatchupsResponseDTO>;
