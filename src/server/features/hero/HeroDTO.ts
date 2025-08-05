import { z } from 'zod';
import { BaseFactionDTO } from '../faction';

export const BaseHeroDTO = z.object({
  id: z.string(),
  name: z.string(),
  faction: BaseFactionDTO,
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BaseHeroDTO = z.infer<typeof BaseHeroDTO>;

export const PaginatedHeroDTO = BaseHeroDTO;
export type PaginatedHeroDTO = z.infer<typeof PaginatedHeroDTO>;

export const CreateHeroDTO = z.object({
  name: z.string().min(1, 'Nom requis'),
  factionId: z.string(),
  imageUrl: z.string().optional(),
});
export type CreateHeroDTO = z.infer<typeof CreateHeroDTO>;

export const UpdateHeroDTO = CreateHeroDTO;
export type UpdateHeroDTO = z.infer<typeof UpdateHeroDTO>;
