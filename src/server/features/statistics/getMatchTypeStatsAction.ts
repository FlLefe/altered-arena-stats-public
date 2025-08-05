'use server';

import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { StatisticsFiltersDTO, MatchTypeStatsResponseDTO } from './StatisticsDTO';
import { getMatchTypeStats } from './StatisticsRepository';

type Params = {
  filters: unknown;
};

export async function getMatchTypeStatsAction({ filters }: Params) {
  try {
    const validationResult = validateWithZodResult(
      StatisticsFiltersDTO,
      filters,
      'getMatchTypeStatsAction',
    );
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await getMatchTypeStats(validationResult.data);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    const response = MatchTypeStatsResponseDTO.parse(result.data);

    return { success: true, data: response };
  } catch (error) {
    console.error('[getMatchTypeStatsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
