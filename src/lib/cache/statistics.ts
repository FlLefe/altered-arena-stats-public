import { cache } from 'react';
import { getHeroMatchups } from '@/server/features/statistics/HeroMatchupRepository';
import { StatisticsFilters } from '@/server/features/statistics/StatisticsDTO';
import {
  getHomePageFactionStats,
  getHomePageWinRateStats,
} from '@/server/features/statistics/StatisticsRepository';
import {
  getFactionStats,
  getWinRateStats,
  getMatchTypeStats,
} from '@/server/features/statistics/StatisticsRepository';

// Optimized cache for the homepage
export const getCachedHomePageStats = cache(async (seasonId: string) => {
  const [factionStatsResult, winRateStatsResult] = await Promise.all([
    getHomePageFactionStats({
      seasonId,
      matchType: 'TOURNAMENT',
      limit: 6,
    }),
    getHomePageWinRateStats({
      seasonId,
      matchType: 'TOURNAMENT',
      limit: 8,
    }),
  ]);

  // Extract data from results
  const factionStats =
    factionStatsResult.type === 'success' ? factionStatsResult.data.factions : [];
  const winRateStats = winRateStatsResult.type === 'success' ? winRateStatsResult.data.heroes : [];

  return { factionStats, winRateStats };
});

// Cache for the full stats page
export const getCachedFullStats = cache(async (filters: StatisticsFilters) => {
  const [factionStatsResult, winRateStatsResult, matchTypeStatsResult, heroMatchupsResult] =
    await Promise.all([
      getFactionStats(filters),
      getWinRateStats(filters),
      getMatchTypeStats(filters),
      getHeroMatchups(filters),
    ]);

  const factionStats =
    factionStatsResult.type === 'success' ? factionStatsResult.data.factions : [];
  const winRateStats = winRateStatsResult.type === 'success' ? winRateStatsResult.data.heroes : [];
  const matchTypeStats = matchTypeStatsResult.type === 'success' ? matchTypeStatsResult.data : null;
  const heroMatchups =
    heroMatchupsResult.type === 'success' ? heroMatchupsResult.data.heroMatchups : [];

  return { factionStats, winRateStats, matchTypeStats, heroMatchups };
});

// Cache for match stats - 5 minutes (more dynamic)
export const getCachedMatchStats = cache(async (matchId: string) => {
  // Here we can add specific stats for a match
  // TODO: Implement match-specific statistics
  console.log('Match stats requested for:', matchId);
  return {};
});

// Cache for basic stats (seasons, etc.) - 30 days
export const getCachedBasicStats = cache(async () => {
  // Here we can add basic stats that change little
  return {};
});
