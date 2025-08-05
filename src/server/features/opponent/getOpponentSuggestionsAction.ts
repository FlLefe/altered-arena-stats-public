'use server';

import { OpponentSuggestionDTO } from './OpponentDTO';
import { getOpponentSuggestions } from './OpponentRepository';

export async function getOpponentSuggestionsAction(query: string) {
  const result = await getOpponentSuggestions(query);

  if (result.type === 'failure') {
    throw new Error(result.reason ?? 'Autocomplete failed');
  }

  return OpponentSuggestionDTO.array().parse(result.data);
}
