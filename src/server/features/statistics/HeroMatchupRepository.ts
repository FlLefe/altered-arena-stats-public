import { Prisma } from '@prisma/client';
import { db } from '@/lib/prisma';
import { withDatabaseResult } from '@/lib/withResult';
import { transformHeroMatchupData, RawHeroMatchupData } from './HeroMatchupValue';
import { StatisticsFilters } from './StatisticsDTO';

export async function getHeroMatchups(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
    // Build the filtering conditions
    const whereConditions = ["m.\"matchStatus\" IN ('WIN', 'LOSS', 'DRAW')"];

    if (filters.seasonId) {
      whereConditions.push(`m."seasonId" = '${filters.seasonId}'`);
    }

    if (filters.matchType && filters.matchType !== 'ALL') {
      whereConditions.push(`m."matchType" = '${filters.matchType}'`);
    }

    if (filters.startDate) {
      whereConditions.push(`m."createdAt" >= '${filters.startDate}'`);
    }

    if (filters.endDate) {
      whereConditions.push(`m."createdAt" <= '${filters.endDate}'`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Native SQL query optimized for hero matchups
    const heroMatchups = await db.$queryRaw<RawHeroMatchupData[]>`
      WITH hero_matchups AS (
        SELECT 
          h.id as "heroId",
          h.name as "heroName",
          f."colorCode" as "factionColor",
          f.name as "factionName",
          oh.id as "opponentHeroId",
          oh.name as "opponentHeroName",
          of."colorCode" as "opponentFactionColor",
          of.name as "opponentFactionName",
          COUNT(*) as games_played,
          SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins,
          SUM(CASE WHEN g."gameStatus" = 'LOSS' THEN 1 ELSE 0 END) as losses,
          SUM(CASE WHEN g."gameStatus" = 'DRAW' THEN 1 ELSE 0 END) as draws
        FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        JOIN "Hero" h ON g."playerHeroId" = h.id
        JOIN "Faction" f ON h."factionId" = f.id
        JOIN "Hero" oh ON g."opponentHeroId" = oh.id
        JOIN "Faction" of ON oh."factionId" = of.id
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY h.id, h.name, f."colorCode", f.name, oh.id, oh.name, of."colorCode", of.name
      ),
      hero_stats AS (
        SELECT 
          "heroId",
          "heroName",
          "factionColor",
          "factionName",
          SUM(games_played) as total_games,
          SUM(wins) as total_wins,
          SUM(losses) as total_losses,
          SUM(draws) as total_draws
        FROM hero_matchups
        GROUP BY "heroId", "heroName", "factionColor", "factionName"
      ),
      best_matchups AS (
        SELECT 
          "heroId",
          "opponentHeroId",
          "opponentHeroName",
          "opponentFactionColor",
          "opponentFactionName",
          games_played,
          wins,
          losses,
          draws,
          ROUND((wins::float / games_played * 100)::numeric, 2)::float as win_rate,
          ROW_NUMBER() OVER (PARTITION BY "heroId" ORDER BY (wins::float / games_played) DESC, games_played DESC) as rn
        FROM hero_matchups
        WHERE games_played > 0
      ),
      worst_matchups AS (
        SELECT 
          "heroId",
          "opponentHeroId",
          "opponentHeroName",
          "opponentFactionColor",
          "opponentFactionName",
          games_played,
          wins,
          losses,
          draws,
          ROUND((wins::float / games_played * 100)::numeric, 2)::float as win_rate,
          ROW_NUMBER() OVER (PARTITION BY "heroId" ORDER BY (wins::float / games_played) ASC, games_played DESC) as rn
        FROM hero_matchups
        WHERE games_played > 0
      ),
      best_aggregated AS (
        SELECT 
          "heroId",
          json_agg(
            json_build_object(
              'opponentHeroId', "opponentHeroId"::text,
              'opponentHeroName', "opponentHeroName",
              'opponentFactionColor', "opponentFactionColor",
              'opponentFactionName', "opponentFactionName",
              'gamesPlayed', games_played::int,
              'wins', wins::int,
              'losses', losses::int,
              'draws', draws::int,
              'winRate', win_rate
            ) ORDER BY win_rate DESC, games_played DESC
          ) as best_matchups
        FROM best_matchups
        WHERE rn <= 3
        GROUP BY "heroId"
      ),
      worst_aggregated AS (
        SELECT 
          "heroId",
          json_agg(
            json_build_object(
              'opponentHeroId', "opponentHeroId"::text,
              'opponentHeroName', "opponentHeroName",
              'opponentFactionColor', "opponentFactionColor",
              'opponentFactionName', "opponentFactionName",
              'gamesPlayed', games_played::int,
              'wins', wins::int,
              'losses', losses::int,
              'draws', draws::int,
              'winRate', win_rate
            ) ORDER BY win_rate ASC, games_played DESC
          ) as worst_matchups
        FROM worst_matchups
        WHERE rn <= 3
        GROUP BY "heroId"
      )
      SELECT 
        hs."heroId"::text,
        hs."heroName",
        hs."factionColor",
        hs."factionName",
        hs.total_games::int as "totalGames",
        CASE 
          WHEN hs.total_games > 0 
          THEN ROUND((hs.total_wins::float / hs.total_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        hs.total_wins::int as "totalWins",
        hs.total_losses::int as "totalLosses",
        hs.total_draws::int as "totalDraws",
        COALESCE(bm.best_matchups, '[]'::json) as "bestMatchups",
        COALESCE(wm.worst_matchups, '[]'::json) as "worstMatchups"
      FROM hero_stats hs
      LEFT JOIN best_aggregated bm ON hs."heroId" = bm."heroId"
      LEFT JOIN worst_aggregated wm ON hs."heroId" = wm."heroId"
      ORDER BY "winRate" DESC, hs.total_games DESC
    `;

    return transformHeroMatchupData(heroMatchups, filters);
  });
}
