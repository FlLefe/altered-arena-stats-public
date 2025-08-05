'use client';

import { useMemo, memo } from 'react';
import { TrendingUp, TrendingDown, Target, Users } from 'lucide-react';
import { FactionIcon } from '@/client/components/FactionIcon';
import { WinRateStats } from '@/server/features/statistics/StatisticsDTO';

type HeroPerformanceChartProps = {
  data: WinRateStats[];
};

function HeroPerformanceChartComponent({ data }: HeroPerformanceChartProps) {
  // Memoized calculations
  const { allHeroes, bestPerformer, worstPerformer, mostPlayed, totalGames, averageGamesPerHero } =
    useMemo(() => {
      const allHeroes = data;

      const bestPerformer = allHeroes.reduce((best, hero) =>
        hero.winRate > best.winRate ? hero : best,
      );

      const worstPerformer = allHeroes.reduce((worst, hero) =>
        hero.winRate < worst.winRate ? hero : worst,
      );

      const mostPlayed = allHeroes.reduce((most, hero) =>
        hero.totalGames > most.totalGames ? hero : most,
      );

      const totalGames = data.reduce((sum, hero) => sum + hero.totalGames, 0);
      const averageGamesPerHero =
        totalGames > 0 && allHeroes.length > 0 ? (totalGames / allHeroes.length).toFixed(1) : '0.0';

      return {
        allHeroes,
        bestPerformer,
        worstPerformer,
        mostPlayed,
        totalGames,
        averageGamesPerHero,
      };
    }, [data]);

  return (
    <div className="space-y-6">
      {/* Global statistics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-blue-600 flex justify-center mb-2">
            <Target className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalGames}</div>
          <div className="text-sm text-gray-600">Total des parties</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-purple-600 flex justify-center mb-2">
            <Users className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{allHeroes.length}</div>
          <div className="text-sm text-gray-600">Héros analysés</div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-orange-600 flex justify-center mb-2">
            <Target className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{averageGamesPerHero}</div>
          <div className="text-sm text-gray-600">Moyenne parties/héros</div>
        </div>
      </div>

      {/* Meilleurs performers */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Meilleur performer */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">Meilleur performer</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FactionIcon
                factionName={bestPerformer.factionName}
                size="sm"
                color={bestPerformer.factionColor}
              />
              <span className="font-semibold text-gray-900">{bestPerformer.heroName}</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {typeof bestPerformer.winRate === 'number' ? bestPerformer.winRate.toFixed(1) : '0.0'}
              %
            </div>
            <div className="text-sm text-gray-600">{bestPerformer.totalGames} parties jouées</div>
            <div className="text-sm text-gray-600">Faction: {bestPerformer.factionName}</div>
          </div>
        </div>

        {/* Héros le plus joué */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Le plus populaire</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FactionIcon
                factionName={mostPlayed.factionName}
                size="sm"
                color={mostPlayed.factionColor}
              />
              <span className="font-semibold text-gray-900">{mostPlayed.heroName}</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{mostPlayed.totalGames}</div>
            <div className="text-sm text-gray-600">parties jouées</div>
            <div className="text-sm text-gray-600">
              Taux: {typeof mostPlayed.winRate === 'number' ? mostPlayed.winRate.toFixed(1) : '0.0'}
              %
            </div>
          </div>
        </div>

        {/* Pire performer */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Moins performant</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FactionIcon
                factionName={worstPerformer.factionName}
                size="sm"
                color={worstPerformer.factionColor}
              />
              <span className="font-semibold text-gray-900">{worstPerformer.heroName}</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {typeof worstPerformer.winRate === 'number'
                ? worstPerformer.winRate.toFixed(1)
                : '0.0'}
              %
            </div>
            <div className="text-sm text-gray-600">{worstPerformer.totalGames} parties jouées</div>
            <div className="text-sm text-gray-600">Faction: {worstPerformer.factionName}</div>
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="bg-surface border rounded-lg p-6">
        <h4 className="font-semibold mb-4">Classement détaillé</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Rang</th>
                <th className="text-left p-2">Héros</th>
                <th className="text-center p-2">Faction</th>
                <th className="text-center p-2">Parties</th>
                <th className="text-center p-2">Victoires</th>
                <th className="text-center p-2">Défaites</th>
                <th className="text-center p-2">Nuls</th>
                <th className="text-center p-2">Taux de victoire global</th>
                <th className="text-center p-2">Tournois</th>
                <th className="text-center p-2">Amicaux</th>
              </tr>
            </thead>
            <tbody>
              {allHeroes.map((hero, index) => (
                <tr key={hero.heroId} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">#{index + 1}</td>
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
                  <td className="text-center p-2 text-green-600">{hero.wins}</td>
                  <td className="text-center p-2 text-red-600">{hero.losses}</td>
                  <td className="text-center p-2 text-yellow-600">{hero.draws}</td>
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

export const HeroPerformanceChart = memo(HeroPerformanceChartComponent);
