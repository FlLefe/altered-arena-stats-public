import type { Event } from '@prisma/client';
import { BaseEventDTO, PaginatedEventDTO } from './EventDTO';

export function mapEventToDTO(event: Event): BaseEventDTO {
  return {
    id: event.id.toString(),
    name: event.name,
    eventType: event.eventType,
    startDate: event.startDate?.toISOString() || null,
    endDate: event.endDate?.toISOString() || null,
    seasonId: event.seasonId?.toString() || null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export function mapEventToPaginatedDTO(
  event: Event & { season: { id: bigint; name: string } | null },
): PaginatedEventDTO {
  return {
    ...mapEventToDTO(event),
    season: event.season
      ? {
          id: event.season.id.toString(),
          name: event.season.name,
        }
      : null,
  };
}
