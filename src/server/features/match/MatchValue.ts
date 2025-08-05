import { Match, Game, Hero, Faction } from '@prisma/client';
import { PaginatedMatchDTO, AdminMatchDTO } from './MatchDTO';

export type MatchWithRelations = Match & {
  player: {
    id: bigint;
    authId: string;
    alteredAlias: string;
  } | null;
  season: {
    id: bigint;
    name: string;
    startDate: Date;
    endDate: Date;
  };
  event: {
    id: bigint;
    name: string;
    eventType: string;
  } | null;
  games: Array<
    Game & {
      playerHero: Hero & {
        faction: Faction;
        imageUrl: string | null;
      };
      opponentHero: Hero & {
        faction: Faction;
        imageUrl: string | null;
      };
    }
  >;
  _count: {
    games: number;
  };
};

export function transformMatchToPaginatedDTO(match: MatchWithRelations): PaginatedMatchDTO {
  return {
    id: match.id.toString(),
    matchType: match.matchType,
    matchFormat: match.matchFormat as 'BO1' | 'BO3' | 'BO5' | 'BO7',
    matchStatus: match.matchStatus,
    comment: match.comment,
    opponentName: match.opponentName,
    opponentId: match.opponentId?.toString() || null,
    playerId: match.playerId?.toString() || null,
    seasonId: match.seasonId.toString(),
    eventId: match.eventId?.toString() || null,
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString(),
    player: match.player
      ? {
          id: match.player.id.toString(),
          alteredAlias: match.player.alteredAlias,
          authId: match.player.authId,
        }
      : null,
    season: {
      id: match.season.id.toString(),
      name: match.season.name,
      startDate: match.season.startDate.toISOString(),
      endDate: match.season.endDate.toISOString(),
    },
    event: match.event
      ? {
          id: match.event.id.toString(),
          name: match.event.name,
          eventType: match.event.eventType as 'DEFAULT' | 'CUSTOM',
        }
      : null,
    games: match.games.map((game) => ({
      id: game.id.toString(),
      gameStatus: game.gameStatus,
      playerHero: {
        id: game.playerHero.id.toString(),
        name: game.playerHero.name,
        faction: {
          id: game.playerHero.faction.id.toString(),
          name: game.playerHero.faction.name,
          colorCode: game.playerHero.faction.colorCode,
        },
      },
      opponentHero: {
        id: game.opponentHero.id.toString(),
        name: game.opponentHero.name,
        faction: {
          id: game.opponentHero.faction.id.toString(),
          name: game.opponentHero.faction.name,
          colorCode: game.opponentHero.faction.colorCode,
        },
      },
    })),
    _count: match._count,
  };
}

export function transformMatchToMatchWithGames(match: MatchWithRelations) {
  return {
    id: match.id.toString(),
    matchType: match.matchType,
    matchFormat: match.matchFormat as 'BO1' | 'BO3' | 'BO5' | 'BO7',
    matchStatus: match.matchStatus,
    comment: match.comment,
    opponentName: match.opponentName,
    opponentId: match.opponentId?.toString() || null,
    playerId: match.playerId?.toString() || null,
    seasonId: match.seasonId.toString(),
    eventId: match.eventId?.toString() || null,
    createdAt: match.createdAt,
    updatedAt: match.updatedAt,
    season: {
      id: match.season.id.toString(),
      name: match.season.name,
      startDate: match.season.startDate,
      endDate: match.season.endDate,
    },
    event: match.event
      ? {
          id: match.event.id.toString(),
          name: match.event.name,
          eventType: match.event.eventType as 'DEFAULT' | 'CUSTOM',
        }
      : null,
    games: match.games.map((game) => ({
      id: game.id.toString(),
      matchId: game.matchId,
      playerHeroId: game.playerHeroId.toString(),
      opponentHeroId: game.opponentHeroId.toString(),
      gameStatus: game.gameStatus,
      comment: game.comment,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      playerHero: {
        id: game.playerHero.id.toString(),
        name: game.playerHero.name,
        imageUrl: game.playerHero.imageUrl,
        faction: {
          id: game.playerHero.faction.id.toString(),
          name: game.playerHero.faction.name,
          colorCode: game.playerHero.faction.colorCode,
        },
      },
      opponentHero: {
        id: game.opponentHero.id.toString(),
        name: game.opponentHero.name,
        imageUrl: game.opponentHero.imageUrl,
        faction: {
          id: game.opponentHero.faction.id.toString(),
          name: game.opponentHero.faction.name,
          colorCode: game.opponentHero.faction.colorCode,
        },
      },
    })),
  };
}

export function transformMatchToAdminDTO(match: MatchWithRelations): AdminMatchDTO {
  return {
    id: match.id.toString(),
    matchType: match.matchType,
    matchFormat: match.matchFormat as 'BO1' | 'BO3' | 'BO5' | 'BO7',
    matchStatus: match.matchStatus,
    comment: match.comment,
    opponentName: match.opponentName,
    opponentId: match.opponentId?.toString() || null,
    playerId: match.playerId?.toString() || null,
    seasonId: match.seasonId.toString(),
    eventId: match.eventId?.toString() || null,
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString(),
    player: match.player
      ? {
          id: match.player.id.toString(),
          alteredAlias: match.player.alteredAlias,
        }
      : null,
    season: {
      id: match.season.id.toString(),
      name: match.season.name,
      startDate: match.season.startDate.toISOString(),
      endDate: match.season.endDate.toISOString(),
    },
    event: match.event
      ? {
          id: match.event.id.toString(),
          name: match.event.name,
          eventType: match.event.eventType as 'DEFAULT' | 'CUSTOM',
        }
      : null,
    games: match.games.map((game) => ({
      id: game.id.toString(),
      gameStatus: game.gameStatus,
      playerHero: {
        id: game.playerHero.id.toString(),
        name: game.playerHero.name,
        faction: {
          id: game.playerHero.faction.id.toString(),
          name: game.playerHero.faction.name,
          colorCode: game.playerHero.faction.colorCode,
        },
      },
      opponentHero: {
        id: game.opponentHero.id.toString(),
        name: game.opponentHero.name,
        faction: {
          id: game.opponentHero.faction.id.toString(),
          name: game.opponentHero.faction.name,
          colorCode: game.opponentHero.faction.colorCode,
        },
      },
    })),
    _count: match._count,
  };
}
