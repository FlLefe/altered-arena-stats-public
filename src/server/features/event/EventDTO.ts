import { z } from 'zod';

export const eventTypeEnum = z.enum(['DEFAULT', 'CUSTOM']);
export type EventType = z.infer<typeof eventTypeEnum>;

export const BaseEventDTO = z.object({
  id: z.string(),
  name: z.string(),
  eventType: eventTypeEnum,
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  seasonId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateEventDTO = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  eventType: eventTypeEnum,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  seasonId: z.string().optional(),
});

export const UpdateEventDTO = CreateEventDTO.partial();

export const PaginatedEventDTO = BaseEventDTO.extend({
  season: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
});

export type BaseEventDTO = z.infer<typeof BaseEventDTO>;
export type CreateEventDTO = z.infer<typeof CreateEventDTO>;
export type UpdateEventDTO = z.infer<typeof UpdateEventDTO>;
export type PaginatedEventDTO = z.infer<typeof PaginatedEventDTO>;

export const EventSuggestionDTO = z.object({
  id: z.string(),
  name: z.string(),
  eventType: eventTypeEnum,
});

export type EventSuggestionDTO = z.infer<typeof EventSuggestionDTO>;
