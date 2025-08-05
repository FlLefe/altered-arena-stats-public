'use client';

import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';
import { HeroMatchupStats } from '@/client/features/statistics/types';
import {
  FactionStats,
  WinRateStats,
  StatisticsFilters,
  MatchTypeStatsResponseDTO,
} from '@/server/features/statistics/StatisticsDTO';

type MatchTypeStatsResponse = z.infer<typeof MatchTypeStatsResponseDTO>;

type UseStatisticsOptions = {
  initialFilters?: StatisticsFilters;
  initialData?: {
    factionStats?: FactionStats[];
    winRateStats?: WinRateStats[];
    matchTypeStats?: MatchTypeStatsResponse | null;
    heroMatchups?: HeroMatchupStats[];
  };
};

export function useStatistics({
  initialFilters = {},
  initialData = {},
}: UseStatisticsOptions = {}) {
  // Data states (initialized with server data)
  const [factionStats, setFactionStats] = useState<FactionStats[]>(initialData.factionStats || []);
  const [winRateStats, setWinRateStats] = useState<WinRateStats[]>(initialData.winRateStats || []);
  const [matchTypeStats, setMatchTypeStats] = useState<MatchTypeStatsResponse | null>(
    initialData.matchTypeStats || null,
  );
  const [heroMatchups, setHeroMatchups] = useState<HeroMatchupStats[]>(
    initialData.heroMatchups || [],
  );

  // Filters state
  const [filters, setFilters] = useState<StatisticsFilters>(initialFilters);

  // Loading states (simplified)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(
    initialData.factionStats?.length ? Date.now() : 0,
  );

  // Memoize filters to avoid useless re-renders
  const memoizedFilters = useMemo(() => filters, [filters]);

  // Function to update filters
  const updateFilters = useCallback((newFilters: Partial<StatisticsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Function to reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Function to update data (called from outside)
  const updateData = useCallback(
    (newData: {
      factionStats?: FactionStats[];
      winRateStats?: WinRateStats[];
      matchTypeStats?: MatchTypeStatsResponse | null;
      heroMatchups?: HeroMatchupStats[];
    }) => {
      if (newData.factionStats !== undefined) setFactionStats(newData.factionStats);
      if (newData.winRateStats !== undefined) setWinRateStats(newData.winRateStats);
      if (newData.matchTypeStats !== undefined) setMatchTypeStats(newData.matchTypeStats);
      if (newData.heroMatchups !== undefined) setHeroMatchups(newData.heroMatchups);

      setLastFetchTime(Date.now());
      setError(null);
    },
    [],
  );

  // Function to handle loading
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Function to handle errors
  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  return {
    // Data
    factionStats,
    winRateStats,
    matchTypeStats,
    heroMatchups,

    // Filters
    filters: memoizedFilters,

    // States
    isLoading,
    error,
    lastFetchTime,

    // Actions
    updateFilters,
    resetFilters,
    updateData,
    setLoading,
    setError: setErrorState,
  };
}
