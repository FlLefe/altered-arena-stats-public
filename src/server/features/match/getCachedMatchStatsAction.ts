'use server';

import { getCachedMatchStats } from '@/lib/cache/match';

export async function getCachedMatchStatsAction(matchId: string) {
  try {
    const data = await getCachedMatchStats(matchId);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[getCachedMatchStatsAction]', error);
    return {
      success: false,
      error: 'Erreur lors du chargement des statistiques du match',
      code: 'INTERNAL_ERROR',
    };
  }
}
