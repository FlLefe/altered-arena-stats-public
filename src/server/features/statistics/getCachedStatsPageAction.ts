'use server';

import { getCachedFullStats } from '@/lib/cache/statistics';
import { getAllSeasonsAction } from '@/server/features/season';
import { StatisticsFilters } from '@/server/features/statistics/StatisticsDTO';
import { getCurrentSeason } from '@/utils/season';

export async function getCachedStatsPageAction(filters?: Partial<StatisticsFilters>) {
  try {
    // Get seasons
    const seasons = await getAllSeasonsAction();
    const currentSeason = getCurrentSeason(seasons);

    if (!currentSeason) {
      return {
        success: false,
        error: 'Aucune saison courante trouvée',
        code: 'NO_CURRENT_SEASON',
      };
    }

    // Prepare default filters (all seasons, all match types)
    const defaultFilters: StatisticsFilters = {
      seasonId: undefined, // No season filter by default = all seasons
      matchType: 'ALL',
      ...filters, // Allow to override with specific filters
    };

    // Get cached stats
    const cachedStats = await getCachedFullStats(defaultFilters);

    return {
      success: true,
      data: {
        factionStats: cachedStats.factionStats,
        winRateStats: cachedStats.winRateStats,
        matchTypeStats: cachedStats.matchTypeStats,
        heroMatchups: cachedStats.heroMatchups,
        currentSeason,
        appliedFilters: defaultFilters,
      },
    };
  } catch (error) {
    console.error('[getCachedStatsPageAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
