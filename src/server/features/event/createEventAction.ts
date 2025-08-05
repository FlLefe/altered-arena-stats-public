'use server';

import { revalidateEvents } from '@/lib/cache/revalidation';
import { isFailure } from '@/lib/result';
import { validateWithZodResult } from '@/lib/validation';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { CreateEventDTO } from './EventDTO';
import { createEvent } from './EventRepository';

type Params = {
  data: unknown;
};

export async function createEventAction({ data }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session) || !session.data) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const validationResult = validateWithZodResult(CreateEventDTO, data, 'createEventAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const eventData = {
      ...validationResult.data,
      eventType: validationResult.data.eventType || 'CUSTOM',
      seasonId: validationResult.data.seasonId || undefined,
    };
    const result = await createEvent(eventData);

    if (isFailure(result)) {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    // Revalidate the events cache
    revalidateEvents();

    return { success: true, data: result.type === 'success' ? result.data : null };
  } catch (error) {
    console.error('[createEventAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
