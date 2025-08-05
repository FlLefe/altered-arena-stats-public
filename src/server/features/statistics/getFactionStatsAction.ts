'use server';

import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { StatisticsFiltersDTO, FactionStatsResponseDTO } from './StatisticsDTO';
import { getFactionStats } from './StatisticsRepository';

type Params = {
  filters: unknown;
};

export async function getFactionStatsAction({ filters }: Params) {
  try {
    const validationResult = validateWithZodResult(
      StatisticsFiltersDTO,
      filters,
      'getFactionStatsAction',
    );
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await getFactionStats(validationResult.data);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    const response = FactionStatsResponseDTO.parse(result.data);

    return { success: true, data: response };
  } catch (error) {
    console.error('[getFactionStatsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
