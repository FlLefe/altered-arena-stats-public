'use server';

import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { OnboardingDTO } from './PlayerDTO';
import { isAlteredAliasTaken, updatePlayerProfile } from './PlayerRepository';

type Params = {
  data: {
    alteredAlias: string;
    favoriteFactionId?: string;
    favoriteHeroId?: string;
  };
};

export async function completeOnboardingAction({ data }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session) || !session.data) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    // Data validation with Zod
    const validationResult = validateWithZodResult(OnboardingDTO, data, 'completeOnboardingAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const { alteredAlias, favoriteFactionId, favoriteHeroId } = validationResult.data;

    // Alias check
    const aliasCheck = await isAlteredAliasTaken(alteredAlias, session.data.authId);
    if (isFailure(aliasCheck)) {
      return { success: false, error: aliasCheck.reason, code: 'DATABASE_ERROR' };
    }
    if (aliasCheck.data) {
      return {
        success: false,
        error: 'Ce pseudo Altered est déjà pris.',
        code: 'ALIAS_ALREADY_TAKEN',
      };
    }

    // Update the profile with alias and marking as complete
    const result = await updatePlayerProfile(session.data.authId, {
      alteredAlias,
      favoriteFactionId,
      favoriteHeroId,
      profileComplete: true,
    });

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    return { success: true };
  } catch (error) {
    console.error('[completeOnboardingAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
