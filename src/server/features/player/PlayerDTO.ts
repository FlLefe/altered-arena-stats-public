import { z } from 'zod';

const playerRoleEnum = z.enum(['user', 'admin']);

export const BasePlayerDTO = z.object({
  id: z.string(),
  authId: z.string(),
  alteredAlias: z.string(),
  role: playerRoleEnum,
  favoriteFaction: z
    .object({
      id: z.string(),
      name: z.string(),
      color: z.string().optional(),
    })
    .nullable(),
  favoriteHero: z
    .object({
      id: z.string(),
      name: z.string(),
      factionId: z.string().optional(),
    })
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type BasePlayerDTO = z.infer<typeof BasePlayerDTO>;

export const PaginatedPlayerDTO = BasePlayerDTO.omit({
  authId: true,
  deletedAt: true,
}).extend({
  profileComplete: z.boolean(),
});

export type PaginatedPlayerDTO = z.infer<typeof PaginatedPlayerDTO>;

export const UpdatePlayerProfileDTO = z.object({
  alteredAlias: z
    .string()
    .min(3, 'Le pseudo doit contenir au moins 3 caractères')
    .max(20, 'Le pseudo ne peut pas dépasser 20 caractères')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores',
    )
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: 'Le pseudo ne peut pas commencer ou finir par un tiret',
    })
    .refine((val) => !val.startsWith('_') && !val.endsWith('_'), {
      message: 'Le pseudo ne peut pas commencer ou finir par un underscore',
    })
    .refine((val) => !/^[0-9]/.test(val), {
      message: 'Le pseudo ne peut pas commencer par un chiffre',
    })
    .transform((val) => val?.trim())
    .optional(),

  favoriteFactionId: z.string().optional(),

  favoriteHeroId: z.string().optional(),

  role: playerRoleEnum.optional(),
});

export type UpdatePlayerProfileDTO = z.infer<typeof UpdatePlayerProfileDTO>;

export const UserWithRoleDTO = z.object({
  alteredAlias: z.string(),
  role: playerRoleEnum,
});

export type UserWithRoleDTO = z.infer<typeof UserWithRoleDTO>;

export const PlayerWithIdDTO = UserWithRoleDTO.extend({
  id: z.union([z.string(), z.number(), z.bigint()]).transform((val) => val.toString()),
  authId: z.string(),
  profileComplete: z.boolean(),
});

export type PlayerWithIdDTO = z.infer<typeof PlayerWithIdDTO>;

export const OnboardingDTO = z.object({
  alteredAlias: z
    .string()
    .min(3, 'Le pseudo doit contenir au moins 3 caractères')
    .max(20, 'Le pseudo ne peut pas dépasser 20 caractères')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores',
    )
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: 'Le pseudo ne peut pas commencer ou finir par un tiret',
    })
    .refine((val) => !val.startsWith('_') && !val.endsWith('_'), {
      message: 'Le pseudo ne peut pas commencer ou finir par un underscore',
    })
    .refine((val) => !/^[0-9]/.test(val), {
      message: 'Le pseudo ne peut pas commencer par un chiffre',
    })
    .transform((val) => val?.trim()),
  favoriteFactionId: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  favoriteHeroId: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
});

export type OnboardingDTO = z.infer<typeof OnboardingDTO>;
