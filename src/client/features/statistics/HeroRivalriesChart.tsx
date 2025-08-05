'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { FactionIcon } from '@/client/components/FactionIcon';
import { HeroMatchupStats } from './types';

type HeroRivalriesChartProps = {
  data: HeroMatchupStats[];
};

function HeroRivalriesChartComponent({ data }: HeroRivalriesChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">Aucune donnée de rivalité disponible</p>
    );
  }

  // Display all heroes
  const allHeroes = data;

  return (
    <div className="space-y-6">
      {/* Detailed rivalries */}
      <div className="space-y-4">
        {/* Mobile version in cards */}
        <div className="block lg:hidden space-y-4">
          {allHeroes.map((hero, index) => (
            <div
              key={`hero-mobile-${hero.heroId}-${index}`}
              className="bg-surface border rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <FactionIcon factionName={hero.factionName} size="sm" color={hero.factionColor} />
                <h5 className="font-semibold text-foreground">{hero.heroName}</h5>
                <span className="text-sm text-gray-500">
                  ({hero.totalGames} parties, {hero.winRate.toFixed(1)}%)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Best matchups */}
                <div>
                  <h6 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Meilleurs matchups
                  </h6>
                  <div className="space-y-2">
                    {hero.bestMatchups.map((matchup, matchupIndex) => (
                      <div
                        key={`best-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FactionIcon
                            factionName={matchup.opponentFactionName}
                            size="sm"
                            color={matchup.opponentFactionColor}
                          />
                          <span className="text-foreground">{matchup.opponentHeroName}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-foreground">
                            {matchup.winRate.toFixed(1)}%
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="text-green-600">{matchup.wins}</span>
                            <span className="text-red-600">{matchup.losses}</span>
                            <span className="text-yellow-600">{matchup.draws}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Worst matchups */}
                <div>
                  <h6 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Pires matchups
                  </h6>
                  <div className="space-y-2">
                    {hero.worstMatchups.map((matchup, matchupIndex) => (
                      <div
                        key={`worst-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FactionIcon
                            factionName={matchup.opponentFactionName}
                            size="sm"
                            color={matchup.opponentFactionColor}
                          />
                          <span className="text-foreground">{matchup.opponentHeroName}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-foreground">
                            {matchup.winRate.toFixed(1)}%
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="text-green-600">{matchup.wins}</span>
                            <span className="text-red-600">{matchup.losses}</span>
                            <span className="text-yellow-600">{matchup.draws}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop version in table */}
        <div className="hidden lg:block">
          <div className="bg-surface border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium" style={{ width: '20%' }}>
                    Héros
                  </th>
                  <th className="px-4 py-3 text-center font-medium" style={{ width: '80px' }}>
                    Parties
                  </th>
                  <th className="px-4 py-3 text-center font-medium" style={{ width: '120px' }}>
                    Taux de victoire global
                  </th>
                  <th className="px-4 py-3 text-left font-medium" style={{ width: '25%' }}>
                    Matchups
                  </th>
                  <th className="px-4 py-3 text-center font-medium" style={{ width: '120px' }}>
                    Taux de victoire du matchup
                  </th>
                  <th className="px-4 py-3 text-center font-medium" style={{ width: '120px' }}>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <span className="text-green-600 font-bold">V</span>
                      <span className="text-red-600 font-bold">D</span>
                      <span className="text-yellow-600 font-bold">É</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allHeroes.map((hero, index) => (
                  <tr key={`hero-table-${hero.heroId}-${index}`} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FactionIcon
                          factionName={hero.factionName}
                          size="sm"
                          color={hero.factionColor}
                        />
                        <span className="font-medium text-foreground">{hero.heroName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-foreground">{hero.totalGames}</td>
                    <td className="px-4 py-3 text-center text-foreground">
                      {hero.winRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-4">
                        {/* Best matchups */}
                        <div>
                          <h6 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Meilleurs matchups
                          </h6>
                          <div className="space-y-1">
                            {hero.bestMatchups.map((matchup, matchupIndex) => (
                              <div
                                key={`table-best-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                                className="flex items-center gap-2 text-sm"
                                style={{ minHeight: '1.5rem' }}
                              >
                                <FactionIcon
                                  factionName={matchup.opponentFactionName}
                                  size="sm"
                                  color={matchup.opponentFactionColor}
                                />
                                <span className="text-foreground">{matchup.opponentHeroName}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Worst matchups */}
                        <div>
                          <h6 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            Pires matchups
                          </h6>
                          <div className="space-y-1">
                            {hero.worstMatchups.map((matchup, matchupIndex) => (
                              <div
                                key={`table-worst-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                                className="flex items-center gap-2 text-sm"
                                style={{ minHeight: '1.5rem' }}
                              >
                                <FactionIcon
                                  factionName={matchup.opponentFactionName}
                                  size="sm"
                                  color={matchup.opponentFactionColor}
                                />
                                <span className="text-foreground">{matchup.opponentHeroName}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-4">
                        {/* Best matchups rates */}
                        <div>
                          <div className="h-6 mb-2"></div>
                          <div className="space-y-1">
                            {hero.bestMatchups.map((matchup, matchupIndex) => (
                              <div
                                key={`table-best-rate-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                                className="flex items-center text-sm"
                                style={{ minHeight: '1.5rem' }}
                              >
                                <span className="text-green-600 font-medium">
                                  {matchup.winRate.toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Worst matchups rates */}
                        <div>
                          <div className="h-6 mb-2"></div>
                          <div className="space-y-1">
                            {hero.worstMatchups.map((matchup, matchupIndex) => (
                              <div
                                key={`table-worst-rate-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                                className="flex items-center text-sm"
                                style={{ minHeight: '1.5rem' }}
                              >
                                <span className="text-red-600 font-medium">
                                  {matchup.winRate.toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-4">
                        {/* Best matchups stats */}
                        <div>
                          <div className="h-6 mb-2"></div>
                          <div className="space-y-1">
                            {hero.bestMatchups.map((matchup, matchupIndex) => (
                              <div
                                key={`table-best-stats-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                                className="grid grid-cols-3 gap-2 text-xs items-center"
                                style={{ minHeight: '1.5rem' }}
                              >
                                <span className="text-green-600 text-center">{matchup.wins}</span>
                                <span className="text-red-600 text-center">{matchup.losses}</span>
                                <span className="text-yellow-600 text-center">{matchup.draws}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Worst matchups stats */}
                        <div>
                          <div className="h-6 mb-2"></div>
                          <div className="space-y-1">
                            {hero.worstMatchups.map((matchup, matchupIndex) => (
                              <div
                                key={`table-worst-stats-${hero.heroId}-${matchup.opponentHeroId}-${matchupIndex}`}
                                className="grid grid-cols-3 gap-2 text-xs items-center"
                                style={{ minHeight: '1.5rem' }}
                              >
                                <span className="text-green-600 text-center">{matchup.wins}</span>
                                <span className="text-red-600 text-center">{matchup.losses}</span>
                                <span className="text-yellow-600 text-center">{matchup.draws}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export const HeroRivalriesChart = HeroRivalriesChartComponent;
