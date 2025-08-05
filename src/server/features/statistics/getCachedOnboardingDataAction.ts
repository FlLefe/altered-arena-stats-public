'use server';

import { getCachedOnboardingData } from '@/lib/cache/static';

export async function getCachedOnboardingDataAction() {
  try {
    const data = await getCachedOnboardingData();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[getCachedOnboardingDataAction]', error);
    return {
      success: false,
      error: 'Erreur lors du chargement des données onboarding',
      code: 'INTERNAL_ERROR',
    };
  }
}
