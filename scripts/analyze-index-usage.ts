#!/usr/bin/env tsx
/**
 * Script d'analyse de l'utilisation des index
 * Usage: npm run analyze:index-usage
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeIndexUsage() {
  console.log("🔍 Analyse de l'utilisation des index");
  console.log('=====================================');

  try {
    // Récupérer la liste des index existants
    const indexes = await prisma.$queryRaw<
      Array<{
        indexName: string;
        tableName: string;
      }>
    >`
      SELECT 
        indexname as "indexName",
        tablename as "tableName"
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY indexname
    `;

    console.log('\n📊 Index existants :');
    console.log('====================');

    for (const index of indexes) {
      console.log(`📋 ${index.indexName} (${index.tableName})`);
    }

    // Recommandations
    console.log('\n💡 Recommandations :');
    console.log('===================');

    console.log(`📊 Total d'index: ${indexes.length}`);

    if (indexes.length > 10) {
      console.log("⚠️  Nombre d'index élevé - considérer une réduction");
    }

    // Vérifier les index critiques pour les statistiques
    const criticalIndexes = [
      'idx_match_stats_composite',
      'idx_game_stats_composite',
      'idx_game_hero_matchup',
      'idx_hero_faction',
      'idx_player_rls_auth_role',
      'idx_match_rls_player',
    ];

    console.log('\n🎯 Index critiques pour les statistiques :');
    console.log('===========================================');

    for (const criticalIndex of criticalIndexes) {
      const exists = indexes.some((idx) => idx.indexName === criticalIndex);
      console.log(`${exists ? '✅' : '❌'} ${criticalIndex}`);
    }

    // Analyser les index par table
    console.log('\n📋 Répartition par table :');
    console.log('==========================');

    const indexByTable = indexes.reduce(
      (acc, index) => {
        acc[index.tableName] = (acc[index.tableName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    Object.entries(indexByTable).forEach(([table, count]) => {
      console.log(`📋 ${table}: ${count} index`);
    });

    console.log("\n✅ Surveiller régulièrement l'utilisation des index");
    console.log('✅ Analyser les requêtes lentes pour optimiser les index');
    console.log("✅ Équilibrer les performances de lecture et d'écriture");
  } catch (error) {
    console.error("❌ Erreur lors de l'analyse:", error);
  }
}

// Exécution du script
analyzeIndexUsage()
  .then(() => {
    console.log('\n✅ Analyse terminée');
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur lors de l'analyse:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
