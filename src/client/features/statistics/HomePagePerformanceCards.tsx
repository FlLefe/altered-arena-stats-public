'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { FactionIcon } from '@/client/components/FactionIcon';
import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';
import { getHomePagePerformanceStatsAction } from '@/server/features/statistics';
import { WinRateStats } from '@/server/features/statistics/StatisticsDTO';
import { getCurrentSeason } from '@/utils/season';

type HomePagePerformanceCardsProps = {
  seasons: BaseSeasonDTO[];
};

export function HomePagePerformanceCards({ seasons }: HomePagePerformanceCardsProps) {
  const [winRateStats, setWinRateStats] = useState<WinRateStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState<BaseSeasonDTO | undefined>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const season = getCurrentSeason(seasons);
        setCurrentSeason(season);

        if (season) {
          const result = await getHomePagePerformanceStatsAction({
            filters: {
              seasonId: season.id,
            },
          });

          if (result.success && result.data) {
            setWinRateStats(result.data.heroes);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [seasons]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-32 mx-auto"></div>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentSeason || winRateStats.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-full">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Aucune donnée disponible pour la saison courante
          </span>
        </div>
      </div>
    );
  }

  // Find the best performers
  const bestPerformer = winRateStats.reduce((best, hero) =>
    hero.winRate > best.winRate ? hero : best,
  );

  const worstPerformer = winRateStats.reduce((worst, hero) =>
    hero.winRate < worst.winRate ? hero : worst,
  );

  const mostPlayed = winRateStats.reduce((most, hero) =>
    hero.totalGames > most.totalGames ? hero : most,
  );

  return (
    <div className="space-y-6">
      {/* Performance cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Best performer */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-success-foreground" />
            <h3 className="text-lg font-semibold text-success-foreground">Meilleur performer</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <FactionIcon
                factionName={bestPerformer.factionName}
                size="sm"
                color={bestPerformer.factionColor}
              />
              <span className="font-semibold text-foreground">{bestPerformer.heroName}</span>
            </div>
            <div className="text-4xl font-bold text-success-foreground">
              {typeof bestPerformer.winRate === 'number' ? bestPerformer.winRate.toFixed(1) : '0.0'}
              %
            </div>
            <div className="text-sm font-medium text-foreground">
              {bestPerformer.totalGames} parties jouées
            </div>
            <div className="text-sm font-medium text-foreground">
              Faction: {bestPerformer.factionName}
            </div>
          </div>
        </div>

        {/* Héros le plus joué */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-5 w-5 text-info-foreground" />
            <h3 className="text-lg font-semibold text-info-foreground">Le plus populaire</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <FactionIcon
                factionName={mostPlayed.factionName}
                size="sm"
                color={mostPlayed.factionColor}
              />
              <span className="font-semibold text-foreground">{mostPlayed.heroName}</span>
            </div>
            <div className="text-4xl font-bold text-info-foreground">{mostPlayed.totalGames}</div>
            <div className="text-sm font-medium text-foreground">parties jouées</div>
            <div className="text-sm font-medium text-foreground">
              Taux: {typeof mostPlayed.winRate === 'number' ? mostPlayed.winRate.toFixed(1) : '0.0'}
              %
            </div>
          </div>
        </div>

        {/* Pire performer */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-[var(--color-error-foreground)]" />
            <h3 className="text-lg font-semibold text-[var(--color-error-foreground)]">
              Moins performant
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <FactionIcon
                factionName={worstPerformer.factionName}
                size="sm"
                color={worstPerformer.factionColor}
              />
              <span className="font-semibold text-foreground">{worstPerformer.heroName}</span>
            </div>
            <div className="text-4xl font-bold text-[var(--color-error-foreground)]">
              {typeof worstPerformer.winRate === 'number'
                ? worstPerformer.winRate.toFixed(1)
                : '0.0'}
              %
            </div>
            <div className="text-sm font-medium text-foreground">
              {worstPerformer.totalGames} parties jouées
            </div>
            <div className="text-sm font-medium text-foreground">
              Faction: {worstPerformer.factionName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
