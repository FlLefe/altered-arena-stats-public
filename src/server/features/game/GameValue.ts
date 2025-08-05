import { Game, Hero, Match } from '@prisma/client';
import { BaseGameDTO, PaginatedGameDTO, AdminGameDTO } from './GameDTO';

type GameWithRelations = Game & {
  playerHero: Hero & {
    faction: {
      id: bigint;
      name: string;
      colorCode: string;
    };
    imageUrl: string | null;
  };
  opponentHero: Hero & {
    faction: {
      id: bigint;
      name: string;
      colorCode: string;
    };
    imageUrl: string | null;
  };
  match: Match & {
    player: {
      id: bigint;
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
  };
};

export function transformGameToBaseDTO(game: GameWithRelations): BaseGameDTO {
  return {
    id: game.id.toString(),
    matchId: game.matchId.toString(),
    playerHeroId: game.playerHeroId.toString(),
    opponentHeroId: game.opponentHeroId.toString(),
    gameStatus: game.gameStatus,
    comment: game.comment,
    createdAt: game.createdAt.toISOString(),
    updatedAt: game.updatedAt.toISOString(),
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
  };
}

export function transformGameToPaginatedDTO(game: GameWithRelations): PaginatedGameDTO {
  return {
    ...transformGameToBaseDTO(game),
    match: {
      id: game.match.id.toString(),
      opponentName: game.match.opponentName,
      player: {
        id: game.match.playerId as bigint,
        alteredAlias: game.match.player?.alteredAlias || '',
      },
      season: {
        id: game.match.seasonId as bigint,
        name: game.match.season?.name || '',
        startDate: game.match.season?.startDate || new Date(),
        endDate: game.match.season?.endDate || new Date(),
      },
      event: game.match.event
        ? {
            id: game.match.event.id as bigint,
            name: game.match.event.name,
            eventType: game.match.event.eventType,
          }
        : null,
    },
  };
}

export function transformGameToAdminDTO(game: GameWithRelations): AdminGameDTO {
  return {
    id: game.id.toString(),
    matchId: game.matchId.toString(),
    playerHeroId: game.playerHeroId.toString(),
    opponentHeroId: game.opponentHeroId.toString(),
    gameStatus: game.gameStatus,
    comment: game.comment,
    createdAt: game.createdAt.toISOString(),
    updatedAt: game.updatedAt.toISOString(),
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
    match: {
      id: game.match.id.toString(),
      opponentName: game.match.opponentName,
      player: {
        id: game.match.player?.id.toString() || '',
        alteredAlias: game.match.player?.alteredAlias || '',
      },
      season: {
        id: game.match.season?.id.toString() || '',
        name: game.match.season?.name || '',
        startDate: game.match.season?.startDate.toISOString() || '',
        endDate: game.match.season?.endDate.toISOString() || '',
      },
      event: game.match.event
        ? {
            id: game.match.event.id.toString(),
            name: game.match.event.name,
            eventType: game.match.event.eventType as 'DEFAULT' | 'CUSTOM',
          }
        : null,
    },
  };
}
