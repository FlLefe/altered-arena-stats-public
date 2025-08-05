import { z } from 'zod';

export const BaseSeasonDTO = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BaseSeasonDTO = z.infer<typeof BaseSeasonDTO>;

export const UpdateSeasonDTO = z.object({
  name: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (aaaa-mm-jj)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (aaaa-mm-jj)'),
});

export type UpdateSeasonDTO = z.infer<typeof UpdateSeasonDTO>;

export const PaginatedSeasonDTO = BaseSeasonDTO.omit({
  updatedAt: true,
});

export type PaginatedSeasonDTO = z.infer<typeof PaginatedSeasonDTO>;

export const CreateSeasonDTO = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de début invalide (aaaa-mm-jj)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de fin invalide (aaaa-mm-jj)'),
});

export type CreateSeasonDTO = z.infer<typeof CreateSeasonDTO>;
