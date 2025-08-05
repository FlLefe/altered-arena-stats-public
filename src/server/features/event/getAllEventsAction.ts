'use server';

import { getAllEvents } from './EventRepository';

export async function getAllEventsAction() {
  try {
    const result = await getAllEvents();

    if (result.type === 'success') {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }
  } catch (error) {
    console.error('[getAllEventsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
