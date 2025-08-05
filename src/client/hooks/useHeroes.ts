'use client';

import { useState, useEffect } from 'react';
import { getAllHeroesAction } from '@/server/features/hero';
import { BaseHeroDTO } from '@/server/features/hero/HeroDTO';

export function useHeroes() {
  const [heroes, setHeroes] = useState<BaseHeroDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeroes = async () => {
      try {
        // Use existing server action (which already uses the cache)
        const data = await getAllHeroesAction();
        setHeroes(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setHeroes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHeroes();
  }, []);

  return {
    heroes,
    isLoading,
    error,
  };
}
