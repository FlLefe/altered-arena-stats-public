'use server';

import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { StatisticsFiltersDTO, WinRateStatsResponseDTO } from './StatisticsDTO';
import { getHomePageWinRateStats } from './StatisticsRepository';

type Params = {
  filters: unknown;
};

export async function getHomePageWinRateStatsAction({ filters }: Params) {
  try {
    const validationResult = validateWithZodResult(
      StatisticsFiltersDTO,
      filters,
      'getHomePageWinRateStatsAction',
    );
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await getHomePageWinRateStats(validationResult.data);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    const response = WinRateStatsResponseDTO.parse(result.data);

    return { success: true, data: response };
  } catch (error) {
    console.error('[getHomePageWinRateStatsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
