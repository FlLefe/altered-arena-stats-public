'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';
import {
  getHomePageFactionStatsAction,
  getHomePageWinRateStatsAction,
} from '@/server/features/statistics';
import { FactionStats, WinRateStats } from '@/server/features/statistics/StatisticsDTO';
import { getCurrentSeason } from '@/utils/season';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

type HomePageChartsContentProps = {
  seasons: BaseSeasonDTO[];
  initialFactionStats?: FactionStats[];
  initialWinRateStats?: WinRateStats[];
};

export function HomePageChartsContent({
  seasons,
  initialFactionStats = [],
  initialWinRateStats = [],
}: HomePageChartsContentProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [labelColor, setLabelColor] = useState(isDark ? '#ffffff' : '#000000');

  const [isMobile, setIsMobile] = useState(false);

  // Update label color when theme changes
  useEffect(() => {
    setLabelColor(isDark ? '#ffffff' : '#000000');
  }, [isDark]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [factionStats, setFactionStats] = useState<FactionStats[]>(initialFactionStats);
  const [winRateStats, setWinRateStats] = useState<WinRateStats[]>(initialWinRateStats);
  const [isLoading, setIsLoading] = useState(
    initialFactionStats.length === 0 && initialWinRateStats.length === 0,
  );
  const [currentSeason, setCurrentSeason] = useState<BaseSeasonDTO | undefined>();

  useEffect(() => {
    const fetchStats = async () => {
      // If we already have initial data, no need to reload
      if (initialFactionStats.length > 0 && initialWinRateStats.length > 0) {
        setFactionStats(initialFactionStats);
        setWinRateStats(initialWinRateStats);
        setCurrentSeason(getCurrentSeason(seasons));
        setIsLoading(false);
        return;
      }

      try {
        const season = getCurrentSeason(seasons);
        setCurrentSeason(season);

        if (season) {
          const [factionResult, winRateResult] = await Promise.all([
            getHomePageFactionStatsAction({
              filters: {
                seasonId: season.id,
              },
            }),
            getHomePageWinRateStatsAction({
              filters: {
                seasonId: season.id,
              },
            }),
          ]);

          if (factionResult.success && factionResult.data) {
            setFactionStats(factionResult.data.factions);
          }

          if (winRateResult.success && winRateResult.data) {
            setWinRateStats(winRateResult.data.heroes);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [seasons, initialFactionStats, initialWinRateStats]);

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div
          className="border rounded-lg p-4 sm:p-6 animate-pulse"
          style={{ backgroundColor: 'var(--color-card)' }}
        >
          <div className="h-6 bg-muted rounded mb-4 mx-auto w-48"></div>
          <div className="h-64 sm:h-80 bg-muted rounded"></div>
        </div>
        <div
          className="border rounded-lg p-4 sm:p-6 animate-pulse"
          style={{ backgroundColor: 'var(--color-card)' }}
        >
          <div className="h-6 bg-muted rounded mb-4 mx-auto w-48"></div>
          <div className="h-64 sm:h-80 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentSeason || (factionStats.length === 0 && winRateStats.length === 0)) {
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

  // Data for the factions chart
  const sortedFactionStats = factionStats.sort((a, b) => b.totalGames - a.totalGames);
  const factionData = {
    labels: sortedFactionStats.map((faction) => faction.factionName),
    datasets: [
      {
        label: 'Parties jouées',
        data: sortedFactionStats.map((faction) => faction.totalGames),
        backgroundColor: sortedFactionStats.map((faction) => faction.factionColor),
        borderColor: sortedFactionStats.map((faction) => faction.factionColor),
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Victoires',
        data: sortedFactionStats.map((faction) => faction.wins),
        backgroundColor: sortedFactionStats.map((faction) => `${faction.factionColor}80`),
        borderColor: sortedFactionStats.map((faction) => faction.factionColor),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Data for the win rate chart
  const sortedWinRateStats = winRateStats.slice(0, 8);
  const winRateData = {
    labels: sortedWinRateStats.map((hero) => hero.heroName),
    datasets: [
      {
        label: 'Taux de victoire (%)',
        data: sortedWinRateStats.map((hero) => hero.winRate),
        backgroundColor: sortedWinRateStats.map((hero) => hero.factionColor),
        borderColor: sortedWinRateStats.map((hero) => hero.factionColor),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const factionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        color: labelColor,
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 8,
        font: {
          size: 10,
          weight: 'bold' as const,
        },
        formatter: function (value: number) {
          return value;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        display: function (context: any) {
          return context.dataset.data[context.dataIndex] > 0;
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            const faction = sortedFactionStats[context.dataIndex];
            const value = typeof context.parsed.y === 'number' ? context.parsed.y : 0;
            if (context.datasetIndex === 0) {
              return `${context.label}: ${value} parties totales`;
            } else {
              const winRate =
                typeof faction.winRate === 'number' ? faction.winRate.toFixed(1) : '0.0';
              return `${context.label}: ${value} victoires (${winRate}%)`;
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          afterLabel: function (context: any) {
            const faction = sortedFactionStats[context.dataIndex];
            return [
              `Défaites: ${faction.losses}`,
              `Nuls: ${faction.draws}`,
              `Tournois: ${faction.tournamentGames}`,
              `Amicaux: ${faction.friendlyGames}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !isMobile,
          text: 'Nombre de parties',
          font: {
            size: 12,
          },
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Factions',
        },
      },
    },
  };

  const winRateChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        color: labelColor,
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 8,
        font: {
          size: 10,
          weight: 'bold' as const,
        },
        formatter: function (value: number) {
          return value.toFixed(1) + '%';
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        display: function (context: any) {
          const data = context.dataset.data[context.dataIndex];
          return typeof data === 'number' && data > 0;
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (this: any, tooltipItem: TooltipItem<'bar'>) {
            const hero = sortedWinRateStats[tooltipItem.dataIndex];
            const value = typeof tooltipItem.parsed.y === 'number' ? tooltipItem.parsed.y : 0;
            const tournamentRate =
              typeof hero.tournamentWinRate === 'number'
                ? hero.tournamentWinRate.toFixed(1)
                : '0.0';
            const friendlyRate =
              typeof hero.friendlyWinRate === 'number' ? hero.friendlyWinRate.toFixed(1) : '0.0';
            return [
              `${tooltipItem.label}: ${value.toFixed(1)}%`,
              `Parties: ${hero.totalGames}`,
              `Victoires: ${hero.wins}`,
              `Tournois: ${tournamentRate}%`,
              `Amicaux: ${friendlyRate}%`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: !isMobile,
          text: 'Taux de victoire (%)',
          font: {
            size: 12,
          },
        },
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function (this: any, tickValue: any) {
            return typeof tickValue === 'number' ? tickValue + '%' : tickValue;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Héros',
        },
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function (this: any, tickValue: any, index: number) {
            const hero = winRateStats[index];
            if (hero) {
              return hero.heroName;
            }
            return tickValue;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Factions chart */}
      {factionStats.length > 0 && (
        <div
          className="border rounded-lg p-4 sm:p-6"
          style={{ backgroundColor: 'var(--color-card)' }}
        >
          <h3 className="text-lg font-semibold mb-2 text-center">
            Performance des <span className="text-primary font-bold">factions</span>
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Données en tournoi pour la saison courante
          </p>

          {/* External legend */}
          <div className="flex items-center gap-4 mb-4 justify-center flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: 'var(--color-primary)' }}
              ></div>
              <span className="text-sm">Parties jouées</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: 'var(--color-primary)', opacity: 0.5 }}
              ></div>
              <span className="text-sm">Victoires</span>
            </div>
          </div>

          <div className="h-64 sm:h-80">
            <Bar data={factionData} options={factionChartOptions} />
          </div>
        </div>
      )}

      {/* Win rate chart */}
      {winRateStats.length > 0 && (
        <div
          className="border rounded-lg p-4 sm:p-6"
          style={{ backgroundColor: 'var(--color-card)' }}
        >
          <h3 className="text-lg font-semibold mb-2 text-center">
            Taux de victoire par <span className="text-primary font-bold">héros</span>
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Top 8 par taux de victoire en tournoi pour la saison courante
          </p>

          <div className="h-64 sm:h-80">
            <Bar data={winRateData} options={winRateChartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
