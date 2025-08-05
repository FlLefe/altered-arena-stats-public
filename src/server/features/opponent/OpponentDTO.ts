import { z } from 'zod';

export const OpponentSuggestionDTO = z.object({
  name: z.string().max(25, 'Nom trop long'),
  id: z.string().nullable(),
});

export type OpponentSuggestionDTO = z.infer<typeof OpponentSuggestionDTO>;
