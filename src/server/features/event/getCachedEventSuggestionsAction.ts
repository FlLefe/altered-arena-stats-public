'use server';

import { getCachedEvents } from '@/lib/cache/static';
import { EventSuggestionDTO } from './EventDTO';

export async function getCachedEventSuggestionsAction(query: string = '') {
  try {
    // Retrieve all events from cache
    const events = await getCachedEvents();

    if (!events) {
      return {
        success: true,
        data: {
          generics: [],
          suggestions: [],
        },
      };
    }

    // Filter events based on query
    const filteredEvents = events.filter((event) =>
      event.name.toLowerCase().includes(query.toLowerCase()),
    );
    // Separate events by type
    const defaultEvents = filteredEvents
      .filter((event) => event.eventType === 'DEFAULT')
      .map((event) => ({
        id: event.id.toString(),
        name: event.name,
        eventType: event.eventType,
      })) as EventSuggestionDTO[];

    const customEvents = filteredEvents
      .filter((event) => event.eventType === 'CUSTOM')
      .map((event) => ({
        id: event.id.toString(),
        name: event.name,
        eventType: event.eventType,
      })) as EventSuggestionDTO[];

    return {
      success: true,
      data: {
        generics: defaultEvents,
        suggestions: customEvents,
      },
    };
  } catch (error) {
    console.error('[getCachedEventSuggestionsAction]', error);
    return {
      success: false,
      error: "Erreur lors du chargement des suggestions d'événements",
      code: 'INTERNAL_ERROR',
    };
  }
}
