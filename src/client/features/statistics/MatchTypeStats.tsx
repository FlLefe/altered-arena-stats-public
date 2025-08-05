'use client';

import { useMemo, memo } from 'react';
import { Trophy, Users, Target, Layers } from 'lucide-react';

type MatchTypeStatsProps = {
  data: {
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
  };
};

function MatchTypeStatsComponent({ data }: MatchTypeStatsProps) {
  const { tournament, friendly, total } = data;

  // Memoized stats cards
  const statsCards = useMemo(
    () => [
      {
        title: 'Total des matchs',
        value: total.matches,
        icon: Trophy,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Total des parties',
        value: total.games,
        icon: Target,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Moyenne parties/match',
        value:
          total.matches > 0
            ? typeof total.games === 'number' && typeof total.matches === 'number'
              ? (total.games / total.matches).toFixed(1)
              : '0.0'
            : '0.0',
        icon: Users,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
      {
        title: 'Formats utilisés',
        value: total.uniqueFormatsCount,
        icon: Layers,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
    ],
    [total],
  );

  return (
    <div className="space-y-6">
      {/* Global statistics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} border rounded-lg p-4 text-center`}>
            <div className={`${stat.color} flex justify-center mb-2`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Detailed comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tournament statistics */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Tournois</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Matchs joués:</span>
              <span className="font-semibold text-gray-900">{tournament.totalMatches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Parties jouées:</span>
              <span className="font-semibold text-gray-900">{tournament.totalGames}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moyenne parties/match:</span>
              <span className="font-semibold text-gray-900">{tournament.averageGamesPerMatch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Format le plus joué:</span>
              <span className="font-semibold text-gray-900">{tournament.mostPlayedFormat}</span>
            </div>
          </div>

          {/* Format breakdown */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition des formats:</h4>
            <div className="space-y-1">
              {Object.entries(tournament.formatBreakdown).map(([format, count]) => (
                <div key={format} className="flex justify-between text-sm">
                  <span className="text-gray-600">{format}:</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Friendly statistics */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Matchs amicaux</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Matchs joués:</span>
              <span className="font-semibold text-gray-900">{friendly.totalMatches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Parties jouées:</span>
              <span className="font-semibold text-gray-900">{friendly.totalGames}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moyenne parties/match:</span>
              <span className="font-semibold text-gray-900">{friendly.averageGamesPerMatch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Format le plus joué:</span>
              <span className="font-semibold text-gray-900">{friendly.mostPlayedFormat}</span>
            </div>
          </div>

          {/* Format breakdown */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition des formats:</h4>
            <div className="space-y-1">
              {Object.entries(friendly.formatBreakdown).map(([format, count]) => (
                <div key={format} className="flex justify-between text-sm">
                  <span className="text-gray-600">{format}:</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Match type distribution */}
      <div className="bg-gray-50 border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Répartition des types de matchs
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {typeof total.matches === 'number' && total.matches > 0
                ? ((tournament.totalMatches / total.matches) * 100).toFixed(1)
                : '0.0'}
              %
            </div>
            <div className="text-sm text-gray-600">Matchs en tournoi</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {typeof total.matches === 'number' && total.matches > 0
                ? ((friendly.totalMatches / total.matches) * 100).toFixed(1)
                : '0.0'}
              %
            </div>
            <div className="text-sm text-gray-600">Matchs amicaux</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const MatchTypeStats = memo(MatchTypeStatsComponent);
