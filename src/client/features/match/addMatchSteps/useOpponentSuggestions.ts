'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/client/hooks/useDebounce';
import { OpponentSuggestionDTO, getOpponentSuggestionsAction } from '@/server/features/opponent';

export function useOpponentSuggestions(input: string) {
  const [suggestions, setSuggestions] = useState<OpponentSuggestionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(input, 300);

  useEffect(() => {
    if (!debounced) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    getOpponentSuggestionsAction(debounced)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [debounced]);

  return { suggestions, loading };
}
