'use server';

import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { CreateMatchDTO } from './MatchDTO';
import { createMatchDraft } from './MatchRepository';

type Params = {
  data: unknown;
};

export async function createMatchDraftAction({ data }: Params) {
  try {
    // 1. Authentication validation
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    // TypeScript now knows session is ResultSuccess<PlayerData>
    const playerData = session.data;

    // 2. Data validation with Zod
    const validationResult = validateWithZodResult(CreateMatchDTO, data, 'createMatchDraftAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    // 3. Create match with business error handling
    const result = await createMatchDraft(playerData.id.toString(), validationResult.data);

    if (isFailure(result)) {
      if (result.reason.includes('matches in progress')) {
        return {
          success: false,
          error: 'Vous avez déjà le nombre maximum de matchs en cours',
          code: 'MAX_MATCHES_REACHED',
        };
      }
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    const matchId = (result as { type: 'success'; data: string }).data;
    return { success: true, data: matchId };
  } catch (error) {
    // Unexpected error handling
    console.error('[createMatchDraftAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
