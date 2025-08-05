'use server';

import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { HeroMatchupsResponseDTO } from './HeroMatchupDTO';
import { getHeroMatchups } from './HeroMatchupRepository';
import { StatisticsFiltersDTO } from './StatisticsDTO';

type Params = {
  filters: unknown;
};

export async function getHeroMatchupsAction({ filters }: Params) {
  try {
    const validationResult = validateWithZodResult(
      StatisticsFiltersDTO,
      filters,
      'getHeroMatchupsAction',
    );
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await getHeroMatchups(validationResult.data);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }
    // Check that data is valid
    if (!result.data || !result.data.heroMatchups || !Array.isArray(result.data.heroMatchups)) {
      return { success: false, error: 'Données invalides', code: 'INVALID_DATA' };
    }

    const response = HeroMatchupsResponseDTO.parse({ heroMatchups: result.data.heroMatchups });

    return { success: true, data: response };
  } catch (error) {
    console.error('[getHeroMatchupsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
