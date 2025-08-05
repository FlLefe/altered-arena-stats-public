'use server';

import { getCachedGameFormData } from '@/lib/cache/static';

export async function getCachedGameFormDataAction() {
  try {
    const data = await getCachedGameFormData();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[getCachedGameFormDataAction]', error);
    return {
      success: false,
      error: 'Erreur lors du chargement des données de formulaire de jeu',
      code: 'INTERNAL_ERROR',
    };
  }
}
