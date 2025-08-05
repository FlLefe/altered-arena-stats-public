import { Prisma } from '@prisma/client';
import { db } from '@/lib/prisma';
import { withDatabaseResult } from '@/lib/withResult';
import { StatisticsFilters } from './StatisticsDTO';

export async function getFactionStats(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
    // Build the filtering conditions
    const whereConditions = ["m.\"matchStatus\" IN ('WIN', 'LOSS', 'DRAW')"];

    // Filter by season
    if (filters.seasonId) {
      whereConditions.push(`m."seasonId" = '${filters.seasonId}'`);
    }

    // Filter by match type (TOURNAMENT, FRIENDLY, or all)
    if (filters.matchType && filters.matchType !== 'ALL') {
      whereConditions.push(`m."matchType" = '${filters.matchType}'`);
    }

    // Filter by start date
    if (filters.startDate) {
      whereConditions.push(`m."createdAt" >= '${filters.startDate}'`);
    }

    // Filter by end date
    if (filters.endDate) {
      whereConditions.push(`m."createdAt" <= '${filters.endDate}'`);
    }

    // Assemble the final WHERE clause
    const whereClause = whereConditions.join(' AND ');

    // Native SQL query optimized for faction statistics
    const factionStats = await db.$queryRaw<
      Array<{
        factionId: string;
        factionName: string;
        factionColor: string;
        totalGames: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        tournamentGames: number;
        friendlyGames: number;
      }>
    >(Prisma.sql`
      -- CTE pour calculer les statistiques de base par faction
      WITH game_stats AS (
        SELECT 
          h."factionId",
          -- Comptage total des parties
          COUNT(*) as total_games,
          -- Comptage des victoires
          SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins,
          -- Comptage des défaites
          SUM(CASE WHEN g."gameStatus" = 'LOSS' THEN 1 ELSE 0 END) as losses,
          -- Comptage des matchs nuls
          SUM(CASE WHEN g."gameStatus" = 'DRAW' THEN 1 ELSE 0 END) as draws,
          -- Parties en tournoi
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' THEN 1 ELSE 0 END) as tournament_games,
          -- Parties amicales
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' THEN 1 ELSE 0 END) as friendly_games
        FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        JOIN "Hero" h ON g."playerHeroId" = h.id
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY h."factionId"
      )
      
      -- Requête principale avec calculs de performance
      SELECT 
        f.id::text as "factionId",
        f.name as "factionName",
        f."colorCode" as "factionColor",
        COALESCE(SUM(gs.total_games), 0)::int as "totalGames",
        COALESCE(SUM(gs.wins), 0)::int as wins,
        COALESCE(SUM(gs.losses), 0)::int as losses,
        COALESCE(SUM(gs.draws), 0)::int as draws,
        -- Calcul du taux de victoire en pourcentage
        CASE 
          WHEN COALESCE(SUM(gs.total_games), 0) > 0 
          THEN ROUND((SUM(gs.wins)::float / SUM(gs.total_games) * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        COALESCE(SUM(gs.tournament_games), 0)::int as "tournamentGames",
        COALESCE(SUM(gs.friendly_games), 0)::int as "friendlyGames"
      FROM "Faction" f
      LEFT JOIN game_stats gs ON f.id = gs."factionId"
      GROUP BY f.id, f.name, f."colorCode"
      -- Filtrer les factions avec au moins une partie
      HAVING COALESCE(SUM(gs.total_games), 0) > 0
      -- Tri par nombre de parties puis par taux de victoire
      ORDER BY "totalGames" DESC, "winRate" DESC
    `);

    return {
      factions: factionStats,
      totalGames: factionStats.reduce((sum, faction) => sum + faction.totalGames, 0),
      period: {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    };
  });
}

export async function getWinRateStats(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
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

    const heroStats = await db.$queryRaw<
      Array<{
        heroId: string;
        heroName: string;
        factionName: string;
        factionColor: string;
        totalGames: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        tournamentWinRate: number;
        friendlyWinRate: number;
      }>
    >(Prisma.sql`
      WITH hero_game_stats AS (
        SELECT 
          h.id as "heroId",
          h.name as "heroName",
          f.name as "factionName",
          f."colorCode" as "factionColor",
          COUNT(*) as total_games,
          SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins,
          SUM(CASE WHEN g."gameStatus" = 'LOSS' THEN 1 ELSE 0 END) as losses,
          SUM(CASE WHEN g."gameStatus" = 'DRAW' THEN 1 ELSE 0 END) as draws,
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' AND g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as tournament_wins,
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' THEN 1 ELSE 0 END) as tournament_games,
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' AND g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as friendly_wins,
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' THEN 1 ELSE 0 END) as friendly_games
        FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        JOIN "Hero" h ON g."playerHeroId" = h.id
        JOIN "Faction" f ON h."factionId" = f.id
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY h.id, h.name, f.name, f."colorCode"
      )
      SELECT 
        "heroId"::text,
        "heroName",
        "factionName",
        "factionColor",
        total_games::int as "totalGames",
        wins::int,
        losses::int,
        draws::int,
        CASE 
          WHEN total_games > 0 
          THEN ROUND((wins::float / total_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        CASE 
          WHEN tournament_games > 0 
          THEN ROUND((tournament_wins::float / tournament_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "tournamentWinRate",
        CASE 
          WHEN friendly_games > 0 
          THEN ROUND((friendly_wins::float / friendly_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "friendlyWinRate"
      FROM hero_game_stats
      ORDER BY "winRate" DESC, "totalGames" DESC
      LIMIT ${filters.limit || 30}
    `);

    return {
      heroes: heroStats,
      totalHeroes: heroStats.length,
      period: {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    };
  });
}

// Optimized for home page - top 6 factions only
export async function getHomePageFactionStats(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
    // Build the filtering conditions
    const whereConditions = ["m.\"matchStatus\" IN ('WIN', 'LOSS', 'DRAW')"];

    // Filter by season
    if (filters.seasonId) {
      whereConditions.push(`m."seasonId" = '${filters.seasonId}'`);
    }

    // Filter by match type (TOURNAMENT, FRIENDLY, or all)
    if (filters.matchType && filters.matchType !== 'ALL') {
      whereConditions.push(`m."matchType" = '${filters.matchType}'`);
    }

    // Assemble the final WHERE clause
    const whereClause = whereConditions.join(' AND ');

    // Native SQL query optimized for home page
    const factionStats = await db.$queryRaw<
      Array<{
        factionId: string;
        factionName: string;
        factionColor: string;
        totalGames: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        tournamentGames: number;
        friendlyGames: number;
      }>
    >(Prisma.sql`
      -- CTE pour calculer les statistiques de base par faction
      WITH game_stats AS (
        SELECT 
          h."factionId",
          COUNT(*) as total_games,
          SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins,
          SUM(CASE WHEN g."gameStatus" = 'LOSS' THEN 1 ELSE 0 END) as losses,
          SUM(CASE WHEN g."gameStatus" = 'DRAW' THEN 1 ELSE 0 END) as draws,
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' THEN 1 ELSE 0 END) as tournament_games,
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' THEN 1 ELSE 0 END) as friendly_games
        FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        JOIN "Hero" h ON g."playerHeroId" = h.id
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY h."factionId"
      )
      
      SELECT 
        f.id::text as "factionId",
        f.name as "factionName",
        f."colorCode" as "factionColor",
        COALESCE(SUM(gs.total_games), 0)::int as "totalGames",
        COALESCE(SUM(gs.wins), 0)::int as wins,
        COALESCE(SUM(gs.losses), 0)::int as losses,
        COALESCE(SUM(gs.draws), 0)::int as draws,
        CASE 
          WHEN COALESCE(SUM(gs.total_games), 0) > 0 
          THEN ROUND((SUM(gs.wins)::float / SUM(gs.total_games) * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        COALESCE(SUM(gs.tournament_games), 0)::int as "tournamentGames",
        COALESCE(SUM(gs.friendly_games), 0)::int as "friendlyGames"
      FROM "Faction" f
      LEFT JOIN game_stats gs ON f.id = gs."factionId"
      GROUP BY f.id, f.name, f."colorCode"
      HAVING COALESCE(SUM(gs.total_games), 0) > 0
      ORDER BY "totalGames" DESC, "winRate" DESC
      LIMIT 6
    `);

    return {
      factions: factionStats,
      totalGames: factionStats.reduce((sum, faction) => sum + faction.totalGames, 0),
      period: {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    };
  });
}

// Optimized for home page - top 8 heroes only
export async function getHomePageWinRateStats(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
    // Build the filtering conditions
    const whereConditions = ["m.\"matchStatus\" IN ('WIN', 'LOSS', 'DRAW')"];

    // Filter by season
    if (filters.seasonId) {
      whereConditions.push(`m."seasonId" = '${filters.seasonId}'`);
    }

    // Filter by match type (TOURNAMENT, FRIENDLY, or all)
    if (filters.matchType && filters.matchType !== 'ALL') {
      whereConditions.push(`m."matchType" = '${filters.matchType}'`);
    }

    // Assemble the final WHERE clause
    const whereClause = whereConditions.join(' AND ');

    // Native SQL query optimized for home page
    const heroStats = await db.$queryRaw<
      Array<{
        heroId: string;
        heroName: string;
        factionId: string;
        factionName: string;
        factionColor: string;
        totalGames: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        tournamentGames: number;
        friendlyGames: number;
        tournamentWinRate: number;
        friendlyWinRate: number;
      }>
    >(Prisma.sql`
      -- CTE pour calculer les statistiques de base par héros
      WITH game_stats AS (
        SELECT 
          h.id as "heroId",
          h.name as "heroName",
          h."factionId",
          COUNT(*) as total_games,
          SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins,
          SUM(CASE WHEN g."gameStatus" = 'LOSS' THEN 1 ELSE 0 END) as losses,
          SUM(CASE WHEN g."gameStatus" = 'DRAW' THEN 1 ELSE 0 END) as draws,
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' THEN 1 ELSE 0 END) as tournament_games,
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' THEN 1 ELSE 0 END) as friendly_games,
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' AND g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as tournament_wins,
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' AND g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as friendly_wins
        FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        JOIN "Hero" h ON g."playerHeroId" = h.id
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY h.id, h.name, h."factionId"
      )
      
      SELECT 
        gs."heroId"::text as "heroId",
        gs."heroName" as "heroName",
        gs."factionId"::text as "factionId",
        f.name as "factionName",
        f."colorCode" as "factionColor",
        gs.total_games::int as "totalGames",
        gs.wins::int as wins,
        gs.losses::int as losses,
        gs.draws::int as draws,
        CASE 
          WHEN gs.total_games > 0 
          THEN ROUND((gs.wins::float / gs.total_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        gs.tournament_games::int as "tournamentGames",
        gs.friendly_games::int as "friendlyGames",
        CASE 
          WHEN gs.tournament_games > 0 
          THEN ROUND((gs.tournament_wins::float / gs.tournament_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "tournamentWinRate",
        CASE 
          WHEN gs.friendly_games > 0 
          THEN ROUND((gs.friendly_wins::float / gs.friendly_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "friendlyWinRate"
      FROM game_stats gs
      JOIN "Faction" f ON gs."factionId" = f.id
      WHERE gs.total_games > 0
      ORDER BY "winRate" DESC, "totalGames" DESC
      LIMIT 8
    `);

    return {
      heroes: heroStats,
      totalGames: heroStats.reduce((sum, hero) => sum + hero.totalGames, 0),
      totalHeroes: heroStats.length,
      period: {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    };
  });
}

// Optimized for performance cards - top 20 only
export async function getHomePagePerformanceStats(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
    // Build the filtering conditions
    const whereConditions = ["m.\"matchStatus\" IN ('WIN', 'LOSS', 'DRAW')"];

    // Filter by season
    if (filters.seasonId) {
      whereConditions.push(`m."seasonId" = '${filters.seasonId}'`);
    }

    // Filter by match type (TOURNAMENT, FRIENDLY, or all)
    if (filters.matchType && filters.matchType !== 'ALL') {
      whereConditions.push(`m."matchType" = '${filters.matchType}'`);
    }

    // Assemble the final WHERE clause
    const whereClause = whereConditions.join(' AND ');

    // Native SQL query optimized for performance cards
    const heroStats = await db.$queryRaw<
      Array<{
        heroId: string;
        heroName: string;
        factionId: string;
        factionName: string;
        factionColor: string;
        totalGames: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        tournamentGames: number;
        friendlyGames: number;
        tournamentWinRate: number;
        friendlyWinRate: number;
      }>
    >(Prisma.sql`
      -- CTE pour calculer les statistiques de base par héros
      WITH game_stats AS (
        SELECT 
          h.id as "heroId",
          h.name as "heroName",
          h."factionId",
          COUNT(*) as total_games,
          SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins,
          SUM(CASE WHEN g."gameStatus" = 'LOSS' THEN 1 ELSE 0 END) as losses,
          SUM(CASE WHEN g."gameStatus" = 'DRAW' THEN 1 ELSE 0 END) as draws,
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' THEN 1 ELSE 0 END) as tournament_games,
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' THEN 1 ELSE 0 END) as friendly_games,
          SUM(CASE WHEN m."matchType" = 'TOURNAMENT' AND g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as tournament_wins,
          SUM(CASE WHEN m."matchType" = 'FRIENDLY' AND g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as friendly_wins
        FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        JOIN "Hero" h ON g."playerHeroId" = h.id
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY h.id, h.name, h."factionId"
      )
      
      SELECT 
        gs."heroId"::text as "heroId",
        gs."heroName" as "heroName",
        gs."factionId"::text as "factionId",
        f.name as "factionName",
        f."colorCode" as "factionColor",
        gs.total_games::int as "totalGames",
        gs.wins::int as wins,
        gs.losses::int as losses,
        gs.draws::int as draws,
        CASE 
          WHEN gs.total_games > 0 
          THEN ROUND((gs.wins::float / gs.total_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        gs.tournament_games::int as "tournamentGames",
        gs.friendly_games::int as "friendlyGames",
        CASE 
          WHEN gs.tournament_games > 0 
          THEN ROUND((gs.tournament_wins::float / gs.tournament_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "tournamentWinRate",
        CASE 
          WHEN gs.friendly_games > 0 
          THEN ROUND((gs.friendly_wins::float / gs.friendly_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "friendlyWinRate"
      FROM game_stats gs
      JOIN "Faction" f ON gs."factionId" = f.id
      WHERE gs.total_games > 0
      ORDER BY "winRate" DESC, "totalGames" DESC
      LIMIT 20
    `);

    return {
      heroes: heroStats,
      totalGames: heroStats.reduce((sum, hero) => sum + hero.totalGames, 0),
      totalHeroes: heroStats.length,
      period: {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    };
  });
}

export async function getMatchTypeStats(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
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

    const matchStats = await db.$queryRaw<
      Array<{
        matchType: string;
        totalMatches: number;
        totalGames: number;
        averageGamesPerMatch: number;
        winRate: number;
        mostPlayedFormat: string;
        formatBreakdown: Record<string, number>;
      }>
    >(Prisma.sql`
      WITH match_stats AS (
        SELECT 
          m."matchType",
          COUNT(DISTINCT m.id) as total_matches,
          COUNT(g.id) as total_games,
          SUM(CASE WHEN m."matchStatus" = 'WIN' THEN 1 ELSE 0 END) as wins
        FROM "Match" m
        LEFT JOIN "Game" g ON m.id = g."matchId"
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY m."matchType"
      ),
      format_stats AS (
        SELECT 
          m."matchType",
          m."matchFormat",
          COUNT(*) as format_count
        FROM "Match" m
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY m."matchType", m."matchFormat"
      ),
      most_played_formats AS (
        SELECT 
          "matchType",
          "matchFormat" as most_played_format
        FROM (
          SELECT 
            "matchType",
            "matchFormat",
            ROW_NUMBER() OVER (PARTITION BY "matchType" ORDER BY format_count DESC) as rn
          FROM format_stats
        ) ranked
        WHERE rn = 1
      ),
      format_breakdowns AS (
        SELECT 
          "matchType",
          jsonb_object_agg("matchFormat", format_count) as format_breakdown
        FROM format_stats
        GROUP BY "matchType"
      )
      SELECT 
        ms."matchType",
        ms.total_matches::int as "totalMatches",
        ms.total_games::int as "totalGames",
        CASE 
          WHEN ms.total_matches > 0 
          THEN ROUND((ms.total_games::float / ms.total_matches)::numeric, 2)::float
          ELSE 0.0
        END as "averageGamesPerMatch",
        CASE 
          WHEN ms.total_matches > 0 
          THEN ROUND((ms.wins::float / ms.total_matches * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        COALESCE(mpf.most_played_format, 'BO1') as "mostPlayedFormat",
        COALESCE(fb.format_breakdown, '{}'::jsonb) as "formatBreakdown"
      FROM match_stats ms
      LEFT JOIN most_played_formats mpf ON ms."matchType" = mpf."matchType"
      LEFT JOIN format_breakdowns fb ON ms."matchType" = fb."matchType"
      ORDER BY ms."matchType"
    `);

    const totalStats = await db.$queryRaw<
      Array<{
        totalMatches: number;
        totalGames: number;
        totalWinRate: number;
        uniqueFormatsCount: number;
      }>
    >(Prisma.sql`
      SELECT 
        COUNT(DISTINCT m.id)::int as "totalMatches",
        COUNT(g.id)::int as "totalGames",
        CASE 
          WHEN COUNT(DISTINCT m.id) > 0 
          THEN ROUND((SUM(CASE WHEN m."matchStatus" = 'WIN' THEN 1 ELSE 0 END)::float / COUNT(DISTINCT m.id) * 100)::numeric, 2)::float
          ELSE 0.0
        END as "totalWinRate",
        COUNT(DISTINCT m."matchFormat")::int as "uniqueFormatsCount"
      FROM "Match" m
      LEFT JOIN "Game" g ON m.id = g."matchId"
      WHERE ${Prisma.raw(whereClause)}
    `);

    const tournament = matchStats.find((s) => s.matchType === 'TOURNAMENT');
    const friendly = matchStats.find((s) => s.matchType === 'FRIENDLY');
    const total = totalStats[0];

    return {
      tournament: tournament
        ? {
            ...tournament,
            matchType: tournament.matchType as 'TOURNAMENT',
          }
        : {
            matchType: 'TOURNAMENT' as const,
            totalMatches: 0,
            totalGames: 0,
            averageGamesPerMatch: 0,
            winRate: 0,
            mostPlayedFormat: 'BO1',
            formatBreakdown: {},
          },
      friendly: friendly
        ? {
            ...friendly,
            matchType: friendly.matchType as 'FRIENDLY',
          }
        : {
            matchType: 'FRIENDLY' as const,
            totalMatches: 0,
            totalGames: 0,
            averageGamesPerMatch: 0,
            winRate: 0,
            mostPlayedFormat: 'BO1',
            formatBreakdown: {},
          },
      total: {
        matches: total?.totalMatches || 0,
        games: total?.totalGames || 0,
        winRate: total?.totalWinRate || 0,
        uniqueFormatsCount: total?.uniqueFormatsCount || 0,
      },
    };
  });
}

export async function getHeroPerformance(filters: StatisticsFilters) {
  return withDatabaseResult(async () => {
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

    const heroStats = await db.$queryRaw<
      Array<{
        heroId: string;
        heroName: string;
        factionName: string;
        factionColor: string;
        totalGames: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        popularity: number;
      }>
    >(Prisma.sql`
      WITH hero_performance AS (
        SELECT 
          h.id as "heroId",
          h.name as "heroName",
          f.name as "factionName",
          f."colorCode" as "factionColor",
          COUNT(*) as total_games,
          SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins,
          SUM(CASE WHEN g."gameStatus" = 'LOSS' THEN 1 ELSE 0 END) as losses,
          SUM(CASE WHEN g."gameStatus" = 'DRAW' THEN 1 ELSE 0 END) as draws
        FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        JOIN "Hero" h ON g."playerHeroId" = h.id
        JOIN "Faction" f ON h."factionId" = f.id
        WHERE ${Prisma.raw(whereClause)}
        GROUP BY h.id, h.name, f.name, f."colorCode"
      ),
      total_games AS (
        SELECT COUNT(*) as total FROM "Game" g
        JOIN "Match" m ON g."matchId" = m.id
        WHERE ${Prisma.raw(whereClause)}
      )
      SELECT 
        "heroId"::text,
        "heroName",
        "factionName",
        "factionColor",
        total_games::int as "totalGames",
        wins::int,
        losses::int,
        draws::int,
        CASE 
          WHEN total_games > 0 
          THEN ROUND((wins::float / total_games * 100)::numeric, 2)::float
          ELSE 0.0
        END as "winRate",
        CASE 
          WHEN (SELECT total FROM total_games) > 0 
          THEN ROUND((total_games::float / (SELECT total FROM total_games) * 100)::numeric, 2)::float
          ELSE 0.0
        END as popularity
      FROM hero_performance
      ORDER BY "totalGames" DESC, "winRate" DESC
      LIMIT ${filters.limit || 20}
    `);

    return {
      heroes: heroStats,
      totalGames: heroStats.reduce((sum, hero) => sum + hero.totalGames, 0),
    };
  });
}
