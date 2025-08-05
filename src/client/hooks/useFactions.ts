'use client';

import { useState, useEffect } from 'react';
import { getAllFactionsAction } from '@/server/features/faction';
import { BaseFactionDTO } from '@/server/features/faction/FactionDTO';

export function useFactions() {
  const [factions, setFactions] = useState<BaseFactionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFactions = async () => {
      try {
        // Use existing server action (which already uses the cache)
        const data = await getAllFactionsAction();
        setFactions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setFactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFactions();
  }, []);

  return {
    factions,
    isLoading,
    error,
  };
}
