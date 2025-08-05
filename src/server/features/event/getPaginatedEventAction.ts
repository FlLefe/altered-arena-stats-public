'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { PaginatedEventDTO } from './EventDTO';
import { getEventsBySearch } from './EventRepository';

type Params = {
  page: number;
  query: string;
};

export async function getPaginatedEventsAction({ page, query }: Params) {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    if (session.data.role !== 'admin') {
      return { success: false, error: 'Accès administrateur requis', code: 'FORBIDDEN' };
    }

    const { items, totalPages } = await getEventsBySearch({ page, query });

    return {
      success: true,
      data: {
        items: PaginatedEventDTO.array().parse(items),
        totalPages,
      },
    };
  } catch (error) {
    console.error('[getPaginatedEventsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
