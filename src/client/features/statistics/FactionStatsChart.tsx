'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import { useTheme } from 'next-themes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FactionIcon } from '@/client/components/FactionIcon';
import { FactionStats } from '@/server/features/statistics/StatisticsDTO';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels,
);

type FactionStatsChartProps = {
  data: FactionStats[];
};

function FactionStatsChartComponent({ data }: FactionStatsChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [labelColor, setLabelColor] = useState(isDark ? '#ffffff' : '#000000');

  // Update label color when theme changes
  useEffect(() => {
    setLabelColor(isDark ? '#ffffff' : '#000000');
  }, [isDark]);

  // Memoized data for bar chart (number of games and win rate)
  const barData = useMemo(
    () => ({
      labels: data.map((faction) => faction.factionName),
      datasets: [
        {
          label: 'Nombre de parties',
          data: data.map((faction) => faction.totalGames),
          backgroundColor: data.map((faction) => faction.factionColor),
          borderColor: data.map((faction) => faction.factionColor),
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Taux de victoire (%)',
          data: data.map((faction) => faction.winRate),
          backgroundColor: data.map((faction) => `${faction.factionColor}80`), // 50% opacity
          borderColor: data.map((faction) => faction.factionColor),
          borderWidth: 1,
          yAxisID: 'y1',
        },
      ],
    }),
    [data],
  );

  // Memoized data for the doughnut chart (win rate)
  const doughnutData = useMemo(
    () => ({
      labels: data.map((faction) => faction.factionName),
      datasets: [
        {
          data: data.map((faction) => faction.winRate),
          backgroundColor: data.map((faction) => faction.factionColor),
          borderColor: data.map((faction) => faction.factionColor),
          borderWidth: 2,
        },
      ],
    }),
    [data],
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
          formatter: function (value: number, context: { datasetIndex: number }) {
            if (context.datasetIndex === 0) {
              return value;
            } else {
              return value.toFixed(1) + '%';
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          display: function (context: any) {
            return context.dataset.data[context.dataIndex] > 0;
          },
        },
        tooltip: {
          callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label: function (this: any, tooltipItem: TooltipItem<'bar'>) {
              const value = typeof tooltipItem.parsed.y === 'number' ? tooltipItem.parsed.y : 0;
              if (tooltipItem.datasetIndex === 0) {
                return `${tooltipItem.label}: ${value} parties`;
              } else {
                return `${tooltipItem.label}: ${value.toFixed(1)}%`;
              }
            },
          },
        },
      },
      scales: {
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nombre de parties',
          },
          ticks: {
            padding: 10,
          },
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Taux de victoire (%)',
          },
          ticks: {
            padding: 10,
            callback: function (this: unknown, tickValue: string | number) {
              return tickValue + '%';
            },
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Factions',
          },
        },
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 10,
          right: 10,
        },
      },
    }),
    [labelColor],
  );

  // Memoized doughnut options
  const doughnutOptions = useMemo(
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
        tooltip: {
          callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label: function (context: any) {
              const value = typeof context.parsed === 'number' ? context.parsed : 0;
              return `${context.label}: ${value.toFixed(1)}%`;
            },
          },
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
            return context.dataset.data[context.dataIndex] > 0;
          },
          anchor: 'center' as const,
          align: 'center' as const,
        },
      },
    }),
    [labelColor],
  );

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-center">
          Parties et taux de victoire par faction
        </h4>
        <div className="overflow-x-auto">
          <div className="h-64 min-w-[800px] sm:min-w-0">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Doughnut chart */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-center">Taux de victoire par faction</h4>
        <div className="flex items-center gap-4 mb-4 justify-center flex-wrap">
          {data.map((faction) => (
            <div key={faction.factionId} className="flex items-center gap-2">
              <FactionIcon
                factionName={faction.factionName}
                size="sm"
                color={faction.factionColor}
              />
              <span className="text-sm">{faction.factionName}</span>
            </div>
          ))}
        </div>
        <div className="h-56 sm:h-64 text-foreground">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Summary table - Mobile version with cards */}
      <div className="mt-6">
        <h4 className="font-semibold mb-3">Détails par faction</h4>

        {/* Mobile version : Cards */}
        <div className="grid grid-cols-1 sm:hidden gap-4">
          {data.map((faction) => (
            <div key={faction.factionId} className="bg-surface border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FactionIcon
                  factionName={faction.factionName}
                  size="sm"
                  color={faction.factionColor}
                />
                <h5 className="font-semibold">{faction.factionName}</h5>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parties:</span>
                  <span className="font-medium">{faction.totalGames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Victoires:</span>
                  <span className="text-green-600 font-medium">{faction.wins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Défaites:</span>
                  <span className="text-red-600 font-medium">{faction.losses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nuls:</span>
                  <span className="text-yellow-600 font-medium">{faction.draws}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Taux de victoire:</span>
                  <span className="font-medium">
                    {typeof faction.winRate === 'number' ? faction.winRate.toFixed(1) : '0.0'}%
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
                <th className="text-left p-2">Faction</th>
                <th className="text-center p-2">Parties</th>
                <th className="text-center p-2">Victoires</th>
                <th className="text-center p-2">Défaites</th>
                <th className="text-center p-2">Nuls</th>
                <th className="text-center p-2">Taux de victoire</th>
              </tr>
            </thead>
            <tbody>
              {data.map((faction) => (
                <tr key={faction.factionId} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <FactionIcon
                        factionName={faction.factionName}
                        size="sm"
                        color={faction.factionColor}
                      />
                      {faction.factionName}
                    </div>
                  </td>
                  <td className="text-center p-2">{faction.totalGames}</td>
                  <td className="text-center p-2 text-green-600">{faction.wins}</td>
                  <td className="text-center p-2 text-red-600">{faction.losses}</td>
                  <td className="text-center p-2 text-yellow-600">{faction.draws}</td>
                  <td className="text-center p-2 font-medium">
                    {typeof faction.winRate === 'number' ? faction.winRate.toFixed(1) : '0.0'}%
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

export const FactionStatsChart = memo(FactionStatsChartComponent);
