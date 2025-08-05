'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import { useTheme } from 'next-themes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Line } from 'react-chartjs-2';
import { FactionIcon } from '@/client/components/FactionIcon';
import { WinRateStats } from '@/server/features/statistics/StatisticsDTO';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartDataLabels,
);

type WinRateChartProps = {
  data: WinRateStats[];
};

function WinRateChartComponent({ data }: WinRateChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [labelColor, setLabelColor] = useState(isDark ? '#ffffff' : '#000000');

  // Update label color when theme changes
  useEffect(() => {
    setLabelColor(isDark ? '#ffffff' : '#000000');
  }, [isDark]);

  // Memoized sorted data for the chart by tournament win rate (from highest to lowest)
  const sortedHeroesForChart = useMemo(
    () => [...data].sort((a, b) => b.tournamentWinRate - a.tournamentWinRate),
    [data],
  );

  // Memoized data for the bar chart (global win rate)
  const barData = useMemo(
    () => ({
      labels: data.map((hero) => hero.heroName),
      datasets: [
        {
          label: 'Taux de victoire global (%)',
          data: data.map((hero) => hero.winRate),
          backgroundColor: data.map((hero) => hero.factionColor),
          borderColor: data.map((hero) => hero.factionColor),
          borderWidth: 1,
        },
      ],
    }),
    [data],
  );

  // Memoized data for the line chart (comparison tournament vs friendly) - sorted by tournament win rate
  const lineData = useMemo(
    () => ({
      labels: sortedHeroesForChart.map((hero) => hero.heroName),
      datasets: [
        {
          label: 'Tournois (%)',
          data: sortedHeroesForChart.map((hero) => hero.tournamentWinRate),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: 'Amicaux (%)',
          data: sortedHeroesForChart.map((hero) => hero.friendlyWinRate),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    }),
    [sortedHeroesForChart],
  );

  // Memoized bar options
  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
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
              const value = typeof tooltipItem.parsed.y === 'number' ? tooltipItem.parsed.y : 0;
              return `${tooltipItem.label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Taux de victoire (%)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Héros',
          },
        },
      },
    }),
    [labelColor],
  );

  // Memoized line options
  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        datalabels: {
          color: labelColor,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          anchor: function (context: any) {
            // For the first dataset (tournaments), anchor at the top
            // For the second dataset (friendly matches), anchor at the bottom
            return context.datasetIndex === 0 ? 'end' : 'start';
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          align: function (context: any) {
            // For the first dataset (tournaments), align at the top
            // For the second dataset (friendly matches), align at the bottom
            return context.datasetIndex === 0 ? 'top' : 'bottom';
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          offset: function (context: any) {
            // For the first dataset (tournaments), positive offset (up)
            // For the second dataset (friendly matches), negative offset (down)
            return context.datasetIndex === 0 ? 8 : -8;
          },
        },
        tooltip: {
          callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label: function (this: any, tooltipItem: TooltipItem<'line'>) {
              const value = typeof tooltipItem.parsed.y === 'number' ? tooltipItem.parsed.y : 0;
              return `${tooltipItem.dataset.label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Taux de victoire (%)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Héros',
          },
        },
      },
    }),
    [labelColor],
  );

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div>
        <div className="flex items-center gap-2 mb-4 justify-center">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">Taux de victoire global (%)</span>
        </div>
        <div className="overflow-x-auto">
          <div className="h-64 min-w-[800px] sm:min-w-0">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Line chart */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-center">Comparaison Tournois vs Amicaux</h4>
        <div className="flex items-center gap-4 mb-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">Tournois (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Amicaux (%)</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="h-64 min-w-[800px] sm:min-w-0">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="mt-6">
        <h4 className="font-semibold mb-3">Détails par héros</h4>

        {/* Version mobile : Cartes */}
        <div className="grid grid-cols-1 sm:hidden gap-4">
          {data.map((hero) => (
            <div key={hero.heroId} className="bg-surface border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FactionIcon factionName={hero.factionName} size="sm" color={hero.factionColor} />
                <h5 className="font-semibold text-foreground">{hero.heroName}</h5>
                <span className="text-sm text-muted-foreground">({hero.factionName})</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parties:</span>
                  <span className="font-medium">{hero.totalGames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux de victoire global:</span>
                  <span className="font-medium">
                    {typeof hero.winRate === 'number' ? hero.winRate.toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tournois:</span>
                  <span className="font-medium">
                    {typeof hero.tournamentWinRate === 'number'
                      ? hero.tournamentWinRate.toFixed(1)
                      : '0.0'}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amicaux:</span>
                  <span className="font-medium">
                    {typeof hero.friendlyWinRate === 'number'
                      ? hero.friendlyWinRate.toFixed(1)
                      : '0.0'}
                    %
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop version : Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Héros</th>
                <th className="text-center p-2">Faction</th>
                <th className="text-center p-2">Parties</th>
                <th className="text-center p-2">Taux de victoire global</th>
                <th className="text-center p-2">Tournois</th>
                <th className="text-center p-2">Amicaux</th>
              </tr>
            </thead>
            <tbody>
              {data.map((hero) => (
                <tr key={hero.heroId} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{hero.heroName}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2 justify-center">
                      <FactionIcon
                        factionName={hero.factionName}
                        size="sm"
                        color={hero.factionColor}
                      />
                      {hero.factionName}
                    </div>
                  </td>
                  <td className="text-center p-2">{hero.totalGames}</td>
                  <td className="text-center p-2 font-medium">
                    {typeof hero.winRate === 'number' ? hero.winRate.toFixed(1) : '0.0'}%
                  </td>
                  <td className="text-center p-2">
                    {typeof hero.tournamentWinRate === 'number'
                      ? hero.tournamentWinRate.toFixed(1)
                      : '0.0'}
                    %
                  </td>
                  <td className="text-center p-2">
                    {typeof hero.friendlyWinRate === 'number'
                      ? hero.friendlyWinRate.toFixed(1)
                      : '0.0'}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const WinRateChart = memo(WinRateChartComponent);
