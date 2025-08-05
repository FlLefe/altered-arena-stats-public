'use client';

import { useState, useEffect } from 'react';
import { getCachedHeroSelectData } from '@/lib/cache/static';
import { BaseFactionDTO, BaseHeroDTO } from '@/server/features';

type HeroSelectData = {
  factions: BaseFactionDTO[];
  heroes: BaseHeroDTO[];
  heroesByFaction: Record<string, BaseHeroDTO[]>;
};

export function useHeroSelect() {
  const [data, setData] = useState<HeroSelectData>({
    factions: [],
    heroes: [],
    heroesByFaction: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Use optimized cache for hero selectors
        const cachedData = await getCachedHeroSelectData();
        setData(cachedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setData({ factions: [], heroes: [], heroesByFaction: {} });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    factions: data.factions,
    heroes: data.heroes,
    heroesByFaction: data.heroesByFaction,
    isLoading,
    error,
  };
}
