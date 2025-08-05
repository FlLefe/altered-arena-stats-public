import { z } from 'zod';
import { sanitizeString } from '@/lib/sanitization';
import { eventTypeEnum } from '@/server/features/event/EventDTO';

const gameStatusEnum = z.enum(['WIN', 'LOSS', 'DRAW']);

// Base DTOs
export const BaseGameDTO = z.object({
  id: z.string(),
  matchId: z.string(),
  playerHeroId: z.string(),
  opponentHeroId: z.string(),
  gameStatus: gameStatusEnum,
  comment: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  playerHero: z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    faction: z.object({
      id: z.string(),
      name: z.string(),
      colorCode: z.string(),
    }),
  }),
  opponentHero: z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    faction: z.object({
      id: z.string(),
      name: z.string(),
      colorCode: z.string(),
    }),
  }),
});

export type BaseGameDTO = z.infer<typeof BaseGameDTO>;

// Paginated DTO for admin
export const PaginatedGameDTO = BaseGameDTO.extend({
  match: z.object({
    id: z.string(),
    opponentName: z.string().nullable(),
    player: z.object({
      id: z.bigint(),
      alteredAlias: z.string(),
    }),
    season: z.object({
      id: z.bigint(),
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }),
    event: z
      .object({
        id: z.bigint(),
        name: z.string(),
        eventType: z.string(),
      })
      .nullable(),
  }),
});

export type PaginatedGameDTO = z.infer<typeof PaginatedGameDTO>;

// DTO for admin (without sensitive data)
export const AdminGameDTO = PaginatedGameDTO.omit({
  match: true,
}).extend({
  match: z.object({
    id: z.string(),
    opponentName: z.string().nullable(),
    player: z.object({
      id: z.string(),
      alteredAlias: z.string(),
    }),
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
  }),
});

export type AdminGameDTO = z.infer<typeof AdminGameDTO>;

// Action DTOs
export const CreateGameDTO = z.object({
  matchId: z.string().min(1), // UUID string
  playerHeroId: z
    .union([z.string().min(1).max(100), z.bigint()])
    .transform((val) => val.toString()),
  opponentHeroId: z
    .union([z.string().min(1).max(100), z.bigint()])
    .transform((val) => val.toString()),
  gameStatus: gameStatusEnum,
  comment: z
    .string()
    .max(500)
    .optional()
    .transform((val) => (val ? sanitizeString(val) : val)),
});

export const UpdateMatchStatusDTO = z.object({
  matchId: z.string().min(1), // UUID string
  status: z.enum(['WIN', 'LOSS', 'DRAW']),
});

export type CreateGameDTO = z.infer<typeof CreateGameDTO>;
export type UpdateMatchStatusDTO = z.infer<typeof UpdateMatchStatusDTO>;
