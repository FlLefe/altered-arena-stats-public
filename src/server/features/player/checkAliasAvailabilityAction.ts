'use server';

import { isAlteredAliasTaken } from './PlayerRepository';

export async function checkAliasAvailabilityAction(alias: string) {
  try {
    const result = await isAlteredAliasTaken(alias);

    if (result.type === 'failure') {
      return { success: false, error: 'Erreur lors de la vérification du pseudo' };
    }

    const isTaken = result.data;
    const isAvailable = !isTaken;

    return {
      success: true,
      isAvailable,
    };
  } catch {
    return { success: false, error: 'Erreur lors de la vérification du pseudo' };
  }
}
