'use client';

import { useState, useEffect } from 'react';
import { getAllSeasonsAction } from '@/server/features/season';
import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';

export function useSeasons() {
  const [seasons, setSeasons] = useState<BaseSeasonDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const data = await getAllSeasonsAction();
        setSeasons(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setSeasons([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeasons();
  }, []);

  return {
    seasons,
    isLoading,
    error,
  };
}
