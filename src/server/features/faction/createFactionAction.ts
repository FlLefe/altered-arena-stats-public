'use server';

import { revalidateFactions } from '@/lib/cache/revalidation';
import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { CreateFactionDTO } from './FactionDTO';
import { createFaction } from './FactionRepository';

type Params = {
  data: unknown;
};

export async function createFactionAction({ data }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const validationResult = validateWithZodResult(CreateFactionDTO, data, 'createFactionAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await createFaction(validationResult.data);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    // Revalidate the factions cache
    revalidateFactions();

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[createFactionAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
