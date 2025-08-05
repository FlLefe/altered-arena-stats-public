'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/client/hooks/useDebounce';
import { EventSuggestionDTO, getCachedEventSuggestionsAction } from '@/server/features/event';

export function useEventSuggestions(input: string) {
  const [suggestions, setSuggestions] = useState<EventSuggestionDTO[]>([]);
  const [generics, setGenerics] = useState<EventSuggestionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialGenerics, setInitialGenerics] = useState<EventSuggestionDTO[]>([]);

  const debounced = useDebounce(input, 300);

  // Load generic events on mount
  useEffect(() => {
    setLoading(true);
    getCachedEventSuggestionsAction('')
      .then((res) => {
        if (res.success && res.data) {
          setGenerics(res.data.generics);
          setInitialGenerics(res.data.generics);
        } else {
          setGenerics([]);
          setInitialGenerics([]);
        }
      })
      .catch(() => {
        setGenerics([]);
        setInitialGenerics([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Loading suggestions when user types
  useEffect(() => {
    if (!debounced) {
      setSuggestions([]);
      setGenerics(initialGenerics);
      return;
    }

    setLoading(true);
    getCachedEventSuggestionsAction(debounced)
      .then((res) => {
        if (res.success && res.data) {
          setGenerics(res.data.generics);
          setSuggestions(res.data.suggestions);
        } else {
          setGenerics([]);
          setSuggestions([]);
        }
      })
      .catch(() => {
        setGenerics([]);
        setSuggestions([]);
      })
      .finally(() => setLoading(false));
  }, [debounced, initialGenerics]);

  return { suggestions, generics, loading };
}
