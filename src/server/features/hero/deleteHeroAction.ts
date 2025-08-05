'use server';

import { revalidateHeroes } from '@/lib/cache/revalidation';
import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { deleteHero } from './HeroRepository';

type Params = {
  id: string;
};

export async function deleteHeroAction({ id }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const result = await deleteHero(id);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    // Revalidate the heroes cache
    revalidateHeroes();

    return { success: true };
  } catch (error) {
    console.error('[deleteHeroAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
