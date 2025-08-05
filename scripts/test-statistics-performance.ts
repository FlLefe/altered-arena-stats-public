#!/usr/bin/env tsx
/**
 * Script de test de performance des statistiques
 * Usage: npm run test:stats-performance
 */
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient();

interface PerformanceTest {
  name: string;
  query: () => Promise<unknown>;
  expectedMaxTime: number; // en millisecondes
}

async function runPerformanceTest(test: PerformanceTest) {
  console.log(`\n🧪 Test: ${test.name}`);

  const startTime = performance.now();

  try {
    const result = await test.query();
    const endTime = performance.now();
    const duration = endTime - startTime;

    const status = duration <= test.expectedMaxTime ? '✅' : '❌';
    console.log(`${status} Durée: ${duration.toFixed(2)}ms (max: ${test.expectedMaxTime}ms)`);

    if (result && Array.isArray(result)) {
      console.log(`   📊 Résultats: ${result.length} éléments`);
    } else if (result && typeof result === 'object') {
      console.log(`   📊 Résultats: ${Object.keys(result).length} propriétés`);
    }

    return { success: duration <= test.expectedMaxTime, duration };
  } catch (error) {
    console.log(`❌ Erreur: ${error}`);
    return { success: false, duration: 0, error };
  }
}

async function testStatisticsPerformance() {
  console.log('🚀 Test de performance des statistiques');
  console.log('=====================================');

  const tests: PerformanceTest[] = [
    {
      name: 'Statistiques des factions (requête optimisée)',
      query: async () => {
        return await prisma.$queryRaw`
          WITH game_stats AS (
            SELECT 
              h."factionId",
              COUNT(*) as total_games,
              SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins
            FROM "Game" g
            JOIN "Match" m ON g."matchId" = m.id
            JOIN "Hero" h ON g."playerHeroId" = h.id
            WHERE m."matchStatus" IN ('WIN', 'LOSS', 'DRAW')
            GROUP BY h."factionId"
          )
          SELECT 
            f.id::text as "factionId",
            f.name as "factionName",
            SUM(gs.total_games) as "totalGames",
            SUM(gs.wins) as wins
          FROM "Faction" f
          LEFT JOIN game_stats gs ON f.id = gs."factionId"
          GROUP BY f.id, f.name
          HAVING SUM(gs.total_games) > 0
          ORDER BY "totalGames" DESC
        `;
      },
      expectedMaxTime: 1000, // 1 seconde
    },

    {
      name: 'Taux de victoire des héros (requête optimisée)',
      query: async () => {
        return await prisma.$queryRaw`
          WITH hero_game_stats AS (
            SELECT 
              h.id as "heroId",
              h.name as "heroName",
              COUNT(*) as total_games,
              SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins
            FROM "Game" g
            JOIN "Match" m ON g."matchId" = m.id
            JOIN "Hero" h ON g."playerHeroId" = h.id
            WHERE m."matchStatus" IN ('WIN', 'LOSS', 'DRAW')
            GROUP BY h.id, h.name
          )
          SELECT 
            "heroId"::text,
            "heroName",
            total_games as "totalGames",
            wins,
            CASE 
              WHEN total_games > 0 
              THEN ROUND((wins::float / total_games * 100)::numeric, 2)
              ELSE 0 
            END as "winRate"
          FROM hero_game_stats
          ORDER BY "totalGames" DESC, "winRate" DESC
          LIMIT 20
        `;
      },
      expectedMaxTime: 1500, // 1.5 secondes
    },

    {
      name: 'Statistiques par type de match',
      query: async () => {
        return await prisma.$queryRaw`
          SELECT 
            m."matchType",
            COUNT(*) as "totalMatches",
            COUNT(g.id) as "totalGames",
            ROUND((SUM(CASE WHEN m."matchStatus" = 'WIN' THEN 1 ELSE 0 END)::float / COUNT(*) * 100)::numeric, 2) as "winRate"
          FROM "Match" m
          LEFT JOIN "Game" g ON m.id = g."matchId"
          WHERE m."matchStatus" IN ('WIN', 'LOSS', 'DRAW')
          GROUP BY m."matchType"
          ORDER BY m."matchType"
        `;
      },
      expectedMaxTime: 500, // 0.5 seconde
    },

    {
      name: 'Matchups de héros (requête complexe)',
      query: async () => {
        return await prisma.$queryRaw`
          WITH hero_matchups AS (
            SELECT 
              h1.id as "heroId",
              h1.name as "heroName",
              h2.id as "opponentHeroId",
              h2.name as "opponentHeroName",
              COUNT(*) as games_played,
              SUM(CASE WHEN g."gameStatus" = 'WIN' THEN 1 ELSE 0 END) as wins
            FROM "Game" g
            JOIN "Match" m ON g."matchId" = m.id
            JOIN "Hero" h1 ON g."playerHeroId" = h1.id
            JOIN "Hero" h2 ON g."opponentHeroId" = h2.id
            WHERE m."matchStatus" IN ('WIN', 'LOSS', 'DRAW')
            GROUP BY h1.id, h1.name, h2.id, h2.name
            HAVING COUNT(*) >= 3
          )
          SELECT 
            "heroId"::text,
            "heroName",
            COUNT(DISTINCT "opponentHeroId") as "uniqueOpponents",
            SUM(games_played) as "totalGames",
            SUM(wins) as "totalWins"
          FROM hero_matchups
          GROUP BY "heroId", "heroName"
          ORDER BY "totalGames" DESC
          LIMIT 10
        `;
      },
      expectedMaxTime: 2000, // 2 secondes
    },

    {
      name: 'Recherche de matchs avec filtres',
      query: async () => {
        return await prisma.$queryRaw`
          SELECT 
            m.id,
            m."matchType",
            m."matchStatus",
            m."createdAt",
            COUNT(g.id) as "gameCount"
          FROM "Match" m
          LEFT JOIN "Game" g ON m.id = g."matchId"
          WHERE m."matchStatus" IN ('WIN', 'LOSS', 'DRAW')
            AND m."matchType" = 'TOURNAMENT'
            AND m."createdAt" >= NOW() - INTERVAL '30 days'
          GROUP BY m.id, m."matchType", m."matchStatus", m."createdAt"
          ORDER BY m."createdAt" DESC
          LIMIT 50
        `;
      },
      expectedMaxTime: 800, // 0.8 seconde
    },
  ];

  const results = [];

  for (const test of tests) {
    const result = await runPerformanceTest(test);
    results.push({ ...test, ...result });
  }

  // Résumé des résultats
  console.log('\n📊 Résumé des tests de performance');
  console.log('==================================');

  const successfulTests = results.filter((r) => r.success);
  const failedTests = results.filter((r) => !r.success);

  console.log(`✅ Tests réussis: ${successfulTests.length}/${results.length}`);
  console.log(`❌ Tests échoués: ${failedTests.length}/${results.length}`);

  if (failedTests.length > 0) {
    console.log('\n❌ Tests échoués:');
    failedTests.forEach((test) => {
      console.log(
        `   - ${test.name}: ${test.duration.toFixed(2)}ms (max: ${test.expectedMaxTime}ms)`,
      );
    });
  }

  const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  console.log(`\n📈 Durée moyenne: ${averageDuration.toFixed(2)}ms`);

  // Test des index
  console.log('\n🔍 Vérification des index');
  console.log('==========================');

  const indexTests = [
    { name: 'idx_match_stats_composite', table: 'Match' },
    { name: 'idx_game_stats_composite', table: 'Game' },
    { name: 'idx_game_hero_matchup', table: 'Game' },
    { name: 'idx_hero_faction', table: 'Hero' },
  ];

  for (const indexTest of indexTests) {
    try {
      const result = await prisma.$queryRaw`
        SELECT indexname, tablename 
        FROM pg_indexes 
        WHERE indexname = ${indexTest.name}
      `;

      if (Array.isArray(result) && result.length > 0) {
        console.log(`✅ Index ${indexTest.name} existe`);
      } else {
        console.log(`❌ Index ${indexTest.name} manquant`);
      }
    } catch (error) {
      console.log(`❌ Erreur lors de la vérification de l'index ${indexTest.name}: ${error}`);
    }
  }

  // Statistiques de la base de données
  console.log('\n📊 Statistiques de la base de données');
  console.log('=====================================');

  try {
    const stats = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM "Match") as match_count,
        (SELECT COUNT(*) FROM "Game") as game_count,
        (SELECT COUNT(*) FROM "Hero") as hero_count,
        (SELECT COUNT(*) FROM "Faction") as faction_count,
        (SELECT COUNT(*) FROM "Player") as player_count
    `;

    if (Array.isArray(stats) && stats.length > 0) {
      const stat = stats[0] as Record<string, number>;
      console.log(`📈 Matchs: ${stat.match_count}`);
      console.log(`🎮 Jeux: ${stat.game_count}`);
      console.log(`⚔️ Héros: ${stat.hero_count}`);
      console.log(`🏛️ Factions: ${stat.faction_count}`);
      console.log(`👤 Joueurs: ${stat.player_count}`);
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la récupération des statistiques: ${error}`);
  }
}

// Exécution du script
testStatisticsPerformance()
  .then(() => {
    console.log('\n✅ Tests de performance terminés');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors des tests:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
