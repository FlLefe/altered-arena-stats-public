'use server';

import { revalidateEvents } from '@/lib/cache/revalidation';
import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { validateAndConvertToBigInt } from '@/utils/index';
import { UpdateEventDTO } from './EventDTO';
import { updateEvent } from './EventRepository';

type Params = {
  id: string;
  data: unknown;
};

export async function updateEventAction({ id, data }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    // ID validation
    const idResult = validateAndConvertToBigInt(id, 'eventId');
    if (!idResult.success) {
      return { success: false, error: idResult.error, code: 'VALIDATION_ERROR' };
    }

    const validationResult = validateWithZodResult(UpdateEventDTO, data, 'updateEventAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const result = await updateEvent(id, validationResult.data);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    // Revalidate the events cache
    revalidateEvents();

    return { success: true, data: result.type === 'success' ? result.data : null };
  } catch (error) {
    console.error('[updateEventAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
