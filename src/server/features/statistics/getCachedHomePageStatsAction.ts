'use server';

import { getCachedHomePageStats } from '@/lib/cache/statistics';
import { getAllSeasonsAction } from '@/server/features/season';
import { getCurrentSeason } from '@/utils/season';

export async function getCachedHomePageStatsAction() {
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

    // Get statistics with cache
    const cachedStats = await getCachedHomePageStats(currentSeason.id.toString());

    return {
      success: true,
      data: {
        factionStats: cachedStats.factionStats,
        winRateStats: cachedStats.winRateStats,
        currentSeason,
      },
    };
  } catch (error) {
    console.error('[getCachedHomePageStatsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
