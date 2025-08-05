import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { HERO_DATA } from './hero-data.mjs';
import {
  FACTION_DATA,
  SEASON_DATA,
  DEFAULT_EVENTS,
  DEFAULT_PLAYER_CONFIG,
} from './seed-config.mjs';

const prisma = new PrismaClient();

// Hero name to ID mapping
const HERO_NAME_TO_ID = new Map();

async function main() {
  const startTime = Date.now();
  console.log('🌱 Starting database seeding...');

  // 1. Create factions
  console.log('📚 Creating factions...');
  const factions = await Promise.all(
    FACTION_DATA.map((faction) =>
      prisma.faction.create({
        data: faction,
      }),
    ),
  );

  // 2. Create heroes
  console.log('⚔️ Creating heroes...');
  for (let i = 0; i < factions.length; i++) {
    for (const heroData of HERO_DATA[i]) {
      const createdHero = await prisma.hero.create({
        data: {
          name: heroData.name,
          imageUrl: heroData.imageUrl,
          factionId: factions[i].id,
        },
      });
      HERO_NAME_TO_ID.set(heroData.name, createdHero.id);
    }
  }

  // 3. Créer les saisons
  console.log('📅 Creating seasons...');
  const seasons = await Promise.all(
    SEASON_DATA.map((season) =>
      prisma.season.create({
        data: {
          name: season.name,
          startDate: new Date(season.startDate),
          endDate: new Date(season.endDate),
        },
      }),
    ),
  );

  // 4. Create default events
  console.log('🎯 Creating default events...');
  for (const eventData of DEFAULT_EVENTS) {
    await prisma.event.upsert({
      where: { name: eventData.name },
      update: {},
      create: {
        ...eventData,
        seasonId: seasons[1].id, // Season 2
      },
    });
  }

  // 5. Create default player
  console.log('👤 Creating default player...');
  const defaultPlayer = await prisma.player.create({
    data: {
      authId: randomUUID(),
      alteredAlias: DEFAULT_PLAYER_CONFIG.alteredAlias,
      favoriteFactionId: factions[0].id,
      favoriteHeroId: HERO_NAME_TO_ID.get(HERO_DATA[0][0].name), // Utiliser le premier héros créé
      role: DEFAULT_PLAYER_CONFIG.role,
    },
  });

  // 6. Load and process BGA tournament data
  console.log('🏆 Loading BGA tournament data...');
  const bgaStartTime = Date.now();
  await seedBgaTournaments(seasons, defaultPlayer);
  const bgaEndTime = Date.now();
  const bgaDuration = (bgaEndTime - bgaStartTime) / 1000;
  console.log(`🏆 BGA data processing time: ${bgaDuration.toFixed(2)} seconds`);

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log('✅ Database seeding completed successfully!');
  const totalHeroes = HERO_DATA.reduce((sum, factionHeroes) => sum + factionHeroes.length, 0);
  console.log(
    `📊 Created: ${factions.length} factions, ${totalHeroes} heroes, ${seasons.length} seasons, 1 default player`,
  );
  console.log(`⏱️  Total seeding time: ${duration.toFixed(2)} seconds`);
}

async function seedBgaTournaments(seasons, defaultPlayer) {
  try {
    // Read JSON file
    const jsonPath = join(process.cwd(), 'prisma', 'bga_tournaments_extract.json');
    const tournamentsData = JSON.parse(readFileSync(jsonPath, 'utf8'));

    // Create a map of seasons for quick access
    const seasonMap = new Map();
    seasons.forEach((season) => {
      seasonMap.set(season.name, season);
    });

    let totalEvents = 0;
    let totalMatches = 0;
    let totalGames = 0;

    // Process each tournament
    for (const tournament of tournamentsData) {
      if (!tournament.season) continue;

      // Check if the season exists
      if (!seasonMap.has(tournament.season)) {
        console.log(
          `⚠️ Skipping tournament "${tournament.title}" - unknown season: ${tournament.season}`,
        );
        continue;
      }

      const season = seasonMap.get(tournament.season);

      // Create the event
      const event = await prisma.event.upsert({
        where: { name: tournament.title },
        update: {},
        create: {
          name: tournament.title,
          eventType: 'CUSTOM',
          startDate: new Date(tournament.date),
          endDate: new Date(tournament.date),
          seasonId: season.id,
        },
      });
      totalEvents++;

      // Créer les matchs (un seul par rencontre, en alternant les perspectives)
      for (const matchData of tournament.matches) {
        // Trouver les héros pour ce match
        const player1Hero = findHeroByName(tournament.players, matchData.player1);
        const player2Hero = findHeroByName(tournament.players, matchData.player2);

        if (player1Hero && player2Hero) {
          // Alterner les perspectives pour équilibrer les statistiques
          // Utiliser l'ordre alphabétique pour être déterministe
          const usePlayer1Perspective = matchData.player1 < matchData.player2;

          let matchStatus, playerHero, opponentHero, opponentName;

          if (usePlayer1Perspective) {
            // Point de vue de player1
            matchStatus = matchData.winner === matchData.player1 ? 'WIN' : 'LOSS';
            playerHero = player1Hero;
            opponentHero = player2Hero;
            opponentName = matchData.player2;
          } else {
            // Point de vue de player2
            matchStatus = matchData.winner === matchData.player2 ? 'WIN' : 'LOSS';
            playerHero = player2Hero;
            opponentHero = player1Hero;
            opponentName = matchData.player1;
          }

          const match = await prisma.match.create({
            data: {
              id: randomUUID(),
              playerId: defaultPlayer.id,
              seasonId: season.id,
              eventId: event.id,
              matchType: 'TOURNAMENT',
              matchFormat: 'BO1',
              matchStatus: matchStatus,
              comment: `Match ${matchData.round} - ${tournament.title} (${usePlayer1Perspective ? 'P1' : 'P2'} perspective)`,
              opponentName: opponentName,
            },
          });
          totalMatches++;

          // Créer le jeu
          await prisma.game.create({
            data: {
              id: randomUUID(),
              matchId: match.id,
              playerHeroId: playerHero,
              opponentHeroId: opponentHero,
              gameStatus: matchStatus,
              comment: `Game 1 - ${matchData.round}`,
            },
          });
          totalGames++;
        }
      }
    }

    console.log(
      `🎯 Created: ${totalEvents} events, ${totalMatches} matches, ${totalGames} games from BGA data`,
    );
  } catch (error) {
    console.error('❌ Error processing BGA tournaments:', error);
  }
}

function findHeroByName(players, playerName) {
  const player = players.find((p) => p.player === playerName);
  if (player && player.deck) {
    return HERO_NAME_TO_ID.get(player.deck);
  }
  return null;
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
