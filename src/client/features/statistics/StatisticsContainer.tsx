'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { FilterContainer } from '@/client/components/shared/FilterContainer';
import { FilterSelect, FilterOption } from '@/client/components/shared/FilterSelect';
import { HeroMatchupStats } from '@/client/features/statistics/types';
import { useStatistics } from '@/client/hooks/useStatistics';
import { Button } from '@/components/ui/button';
import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';
import {
  getFactionStatsAction,
  getWinRateStatsAction,
  getMatchTypeStatsAction,
  getHeroMatchupsAction,
} from '@/server/features/statistics';
import {
  FactionStats,
  WinRateStats,
  StatisticsFilters,
} from '@/server/features/statistics/StatisticsDTO';
import { FactionStatsChart } from './FactionStatsChart';
import { HeroPerformanceChart } from './HeroPerformanceChart';
import { HeroRivalriesChart } from './HeroRivalriesChart';
import { MatchTypeStats } from './MatchTypeStats';
import { WinRateChart } from './WinRateChart';

// Skeleton component for statistics blocks
function StatisticsSkeleton() {
  return (
    <div
      className="border rounded-lg p-4 sm:p-6 animate-pulse"
      style={{ backgroundColor: 'var(--color-card)' }}
    >
      <div className="h-6 bg-muted rounded mb-4 mx-auto w-48"></div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
      <div className="mt-6 h-32 bg-muted rounded"></div>
    </div>
  );
}

type StatisticsContainerProps = {
  initialSeasons: BaseSeasonDTO[];
  initialFactionStats?: FactionStats[];
  initialWinRateStats?: WinRateStats[];
  initialMatchTypeStats?: {
    tournament: {
      matchType: 'TOURNAMENT' | 'FRIENDLY';
      totalMatches: number;
      totalGames: number;
      averageGamesPerMatch: number;
      winRate: number;
      mostPlayedFormat: string;
      formatBreakdown: Record<string, number>;
    };
    friendly: {
      matchType: 'TOURNAMENT' | 'FRIENDLY';
      totalMatches: number;
      totalGames: number;
      averageGamesPerMatch: number;
      winRate: number;
      mostPlayedFormat: string;
      formatBreakdown: Record<string, number>;
    };
    total: {
      matches: number;
      games: number;
      winRate: number;
      uniqueFormatsCount: number;
    };
  } | null;
  initialHeroMatchups?: HeroMatchupStats[];
  initialFilters?: StatisticsFilters;
};

export function StatisticsContainer({
  initialSeasons,
  initialFactionStats = [],
  initialWinRateStats = [],
  initialMatchTypeStats = null,
  initialHeroMatchups = [],
  initialFilters = {},
}: StatisticsContainerProps) {
  const [showFilters, setShowFilters] = useState(false);

  const {
    factionStats,
    winRateStats,
    matchTypeStats,
    heroMatchups,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    updateData,
    setLoading,
    setError,
  } = useStatistics({
    initialFilters,
    initialData: {
      factionStats: initialFactionStats,
      winRateStats: initialWinRateStats,
      matchTypeStats: initialMatchTypeStats,
      heroMatchups: initialHeroMatchups,
    },
  });

  // Memoize the options to avoid re-renders
  const seasonOptions: FilterOption[] = useMemo(
    () => [
      { value: 'all', label: 'Toutes les saisons' },
      ...initialSeasons.map((season) => ({
        value: season.id.toString(),
        label: season.name,
      })),
    ],
    [initialSeasons],
  );

  const matchTypeOptions: FilterOption[] = useMemo(
    () => [
      { value: 'ALL', label: 'Tous les types' },
      { value: 'TOURNAMENT', label: 'Tournois' },
      { value: 'FRIENDLY', label: 'Amicaux' },
    ],
    [],
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleSeasonChange = useCallback(
    (value: string) => {
      updateFilters({ seasonId: value === 'all' ? undefined : value });
    },
    [updateFilters],
  );

  const handleMatchTypeChange = useCallback(
    (value: string) => {
      updateFilters({ matchType: value as 'TOURNAMENT' | 'FRIENDLY' | 'ALL' });
    },
    [updateFilters],
  );

  // Function to load data with new filters
  const loadDataWithFilters = useCallback(
    async (newFilters: StatisticsFilters) => {
      setLoading(true);
      setError(null);

      try {
        const [factionResult, winRateResult, matchTypeResult, heroMatchupsResult] =
          await Promise.allSettled([
            getFactionStatsAction({ filters: newFilters }),
            getWinRateStatsAction({ filters: newFilters }),
            getMatchTypeStatsAction({ filters: newFilters }),
            getHeroMatchupsAction({ filters: newFilters }),
          ]);

        const newData: {
          factionStats?: FactionStats[];
          winRateStats?: WinRateStats[];
          matchTypeStats?: typeof initialMatchTypeStats;
          heroMatchups?: HeroMatchupStats[];
        } = {};

        if (factionResult.status === 'fulfilled' && factionResult.value.success) {
          newData.factionStats = factionResult.value.data?.factions || [];
        }

        if (winRateResult.status === 'fulfilled' && winRateResult.value.success) {
          newData.winRateStats = winRateResult.value.data?.heroes || [];
        }

        if (matchTypeResult.status === 'fulfilled' && matchTypeResult.value.success) {
          newData.matchTypeStats = matchTypeResult.value.data;
        }

        if (heroMatchupsResult.status === 'fulfilled' && heroMatchupsResult.value.success) {
          newData.heroMatchups = heroMatchupsResult.value.data?.heroMatchups || [];
        }

        updateData(newData);
      } catch (error) {
        console.error('[StatisticsContainer] Erreur lors du chargement:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, updateData],
  );

  // Effect to load data when filters change
  useEffect(() => {
    // Don't load on initial mount (data comes from server)
    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      return;
    }

    // Load data with new filters
    loadDataWithFilters(filters);
  }, [filters, initialFilters, loadDataWithFilters]);

  const hasData =
    factionStats.length > 0 || winRateStats.length > 0 || matchTypeStats || heroMatchups.length > 0;

  // Determine if we should show the skeletons
  const shouldShowSkeletons = isLoading;

  // Determine if we have data or if we are loading
  const hasDataOrLoading = hasData || shouldShowSkeletons;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with filters button */}
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Statistiques détaillées</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Analysez les performances et découvrez les métas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              disabled={isLoading}
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              Réinitialiser
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDataWithFilters(filters)}
              disabled={isLoading}
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-surface border rounded-lg p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-semibold text-lg">Filtres</h3>
          </div>

          <FilterContainer className="flex flex-col sm:flex-row gap-4">
            <FilterSelect
              value={filters.seasonId || 'all'}
              onValueChange={handleSeasonChange}
              options={seasonOptions}
              placeholder="Sélectionner une saison"
              width="w-full sm:w-48"
            />

            <FilterSelect
              value={filters.matchType || 'ALL'}
              onValueChange={handleMatchTypeChange}
              options={matchTypeOptions}
              placeholder="Type de match"
              width="w-full sm:w-40"
            />
          </FilterContainer>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 sm:p-6">
          <p className="text-destructive text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* No data message - only if there is no loading and no data */}
      {!hasDataOrLoading && !error && (
        <div className="text-center py-12 sm:py-16">
          <div className="text-muted-foreground space-y-2">
            <p className="text-lg sm:text-xl font-medium">Aucune donnée disponible</p>
            <p className="text-sm sm:text-base">
              Essayez de modifier les filtres ou de recharger les données
            </p>
          </div>
        </div>
      )}

      {/* Display the blocks with skeletons */}
      {hasDataOrLoading && (
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Match type stats - first because it's the simplest */}
          {shouldShowSkeletons ? (
            <StatisticsSkeleton />
          ) : matchTypeStats ? (
            <div
              className="border rounded-lg p-4 sm:p-6"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Répartition par type de <span className="text-primary font-bold">match</span>
              </h3>
              <MatchTypeStats data={matchTypeStats} />
            </div>
          ) : null}

          {/* 2. Faction stats - second because it's important */}
          {shouldShowSkeletons ? (
            <StatisticsSkeleton />
          ) : factionStats.length > 0 ? (
            <div
              className="border rounded-lg p-4 sm:p-6"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Performance des <span className="text-primary font-bold">factions</span>
              </h3>
              <FactionStatsChart data={factionStats} />
            </div>
          ) : null}

          {/* 3. Hero win rate - third */}
          {shouldShowSkeletons ? (
            <StatisticsSkeleton />
          ) : winRateStats.length > 0 ? (
            <div
              className="border rounded-lg p-4 sm:p-6"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Taux de victoire par <span className="text-primary font-bold">héros</span>
              </h3>
              <WinRateChart data={winRateStats} />
            </div>
          ) : null}

          {/* 4. Hero rivalries - last because it's the most complex */}
          {shouldShowSkeletons ? (
            <StatisticsSkeleton />
          ) : heroMatchups.length > 0 ? (
            <div
              className="border rounded-lg p-4 sm:p-6"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                <span className="text-primary font-bold">Rivalités</span> entre héros
              </h3>
              <HeroRivalriesChart data={heroMatchups} />
            </div>
          ) : null}

          {/* 5. Detailed hero performance - last */}
          {winRateStats.length > 0 ? (
            <div
              className="border rounded-lg p-6 sm:p-8"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Performance détaillée des <span className="text-primary font-bold">héros</span>
              </h3>
              <HeroPerformanceChart data={[...winRateStats]} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
