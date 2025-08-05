import { z } from 'zod';

export const BaseFactionDTO = z.object({
  id: z.string(),
  name: z.string(),
  colorCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BaseFactionDTO = z.infer<typeof BaseFactionDTO>;

export const PaginatedFactionDTO = BaseFactionDTO;
export type PaginatedFactionDTO = z.infer<typeof PaginatedFactionDTO>;

export const CreateFactionDTO = z.object({
  name: z.string().min(1, 'Nom requis'),
  colorCode: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Code couleur hexadécimal invalide'),
});
export type CreateFactionDTO = z.infer<typeof CreateFactionDTO>;

export const UpdateFactionDTO = CreateFactionDTO;
export type UpdateFactionDTO = z.infer<typeof UpdateFactionDTO>;
