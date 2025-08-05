'use server';

import { isFailure } from '@/lib/result';
import { getEventSuggestions, getGenericEvents } from './EventRepository';

export async function getEventSuggestionsAction(query: string) {
  try {
    const trimmed = query.trim().toLowerCase();

    const [custom, generics] = await Promise.all([
      getEventSuggestions(trimmed),
      getGenericEvents(),
    ]);

    if (isFailure(custom)) {
      return { success: false, error: custom.reason, code: 'DATABASE_ERROR' };
    }

    if (isFailure(generics)) {
      return { success: false, error: generics.reason, code: 'DATABASE_ERROR' };
    }

    // If no search query, return only generic events
    if (!trimmed) {
      return {
        success: true,
        data: generics.data,
      };
    }

    // If there's a search query, include matching generics and matching customs
    const matchingGenerics = generics.data.filter((e) => e.name.toLowerCase().includes(trimmed));
    const matchingCustoms = custom.data.filter((e) => e.name.toLowerCase().includes(trimmed));

    // Always put DEFAULT events first, then CUSTOM events
    const all = [...matchingGenerics, ...matchingCustoms]
      .filter((e, i, arr) => arr.findIndex((a) => a.name === e.name) === i)
      .slice(0, 10);

    return {
      success: true,
      data: all,
    };
  } catch (error) {
    console.error('[getEventSuggestionsAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
