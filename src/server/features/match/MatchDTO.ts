import { z } from 'zod';
import { sanitizeString } from '@/lib/sanitization';
import { eventTypeEnum } from '@/server/features/event/EventDTO';

export const matchTypeEnum = z.enum(['TOURNAMENT', 'FRIENDLY']);
export type MatchType = z.infer<typeof matchTypeEnum>;

export const matchFormatEnum = z.enum(['BO1', 'BO3', 'BO5', 'BO7']);
export type MatchFormat = z.infer<typeof matchFormatEnum>;

export const MatchStatusEnum = z.enum(['WIN', 'LOSS', 'DRAW', 'IN_PROGRESS']);
export type MatchStatus = z.infer<typeof MatchStatusEnum>;

export const CreateMatchDTO = z.object({
  matchType: matchTypeEnum,
  matchFormat: matchFormatEnum,
  seasonId: z
    .union([z.string().min(1, 'La saison est requise').max(100), z.bigint()])
    .transform((val) => val.toString())
    .transform(sanitizeString),
  opponentName: z
    .string()
    .min(1, "Le nom de l'adversaire est requis")
    .max(100, "Le nom de l'adversaire ne peut pas dépasser 100 caractères")
    .transform(sanitizeString),
  comment: z
    .string()
    .max(500)
    .optional()
    .transform((val) => (val ? sanitizeString(val) : val)),
  eventId: z
    .union([z.string().min(1).max(100), z.bigint()])
    .transform((val) => val.toString())
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type CreateMatchDTO = z.infer<typeof CreateMatchDTO>;

// Paginated DTO for admin
export const PaginatedMatchDTO = z.object({
  id: z.string(),
  matchType: matchTypeEnum,
  matchFormat: matchFormatEnum,
  matchStatus: MatchStatusEnum,
  comment: z.string().nullable(),
  opponentName: z.string().nullable(),
  opponentId: z.string().nullable(),
  playerId: z.string().nullable(),
  seasonId: z.string(),
  eventId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  player: z
    .object({
      id: z.string(),
      alteredAlias: z.string(),
      authId: z.string(),
    })
    .nullable(),
  season: z.object({
    id: z.string(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  }),
  event: z
    .object({
      id: z.string(),
      name: z.string(),
      eventType: eventTypeEnum,
    })
    .nullable(),
  games: z.array(
    z.object({
      id: z.string(),
      gameStatus: z.string(),
      playerHero: z.object({
        id: z.string(),
        name: z.string(),
        faction: z.object({
          id: z.string(),
          name: z.string(),
          colorCode: z.string(),
        }),
      }),
      opponentHero: z.object({
        id: z.string(),
        name: z.string(),
        faction: z.object({
          id: z.string(),
          name: z.string(),
          colorCode: z.string(),
        }),
      }),
    }),
  ),
  _count: z.object({
    games: z.number(),
  }),
});

export type PaginatedMatchDTO = z.infer<typeof PaginatedMatchDTO>;

// DTO for admin (without sensitive data)
export const AdminMatchDTO = PaginatedMatchDTO.omit({
  player: true,
}).extend({
  player: z
    .object({
      id: z.string(),
      alteredAlias: z.string(),
    })
    .nullable(),
});

export type AdminMatchDTO = z.infer<typeof AdminMatchDTO>;
