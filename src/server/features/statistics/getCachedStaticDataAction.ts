'use server';

import { getCachedStaticData } from '@/lib/cache/static';

export async function getCachedStaticDataAction() {
  try {
    const data = await getCachedStaticData();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[getCachedStaticDataAction]', error);
    return {
      success: false,
      error: 'Erreur lors du chargement des données statiques',
      code: 'INTERNAL_ERROR',
    };
  }
}
