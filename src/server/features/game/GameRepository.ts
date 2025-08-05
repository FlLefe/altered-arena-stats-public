import { GameStatus, type Game, type Match } from '@prisma/client';
import { PAGINATION } from '@/constants/pagination';
import { db } from '@/lib/prisma';
import { generateUUID } from '@/lib/utils';
import { withResult } from '@/lib/withResult';
import { validateAndConvertToBigInt } from '@/utils/index';

export type CreateGameData = {
  matchId: string;
  playerHeroId: string;
  opponentHeroId: string;
  gameStatus: GameStatus;
  comment?: string;
};

export const createGame = async (data: CreateGameData) => {
  // Validate and convert IDs
  const playerHeroIdResult = validateAndConvertToBigInt(data.playerHeroId, 'playerHeroId');
  if (!playerHeroIdResult.success) {
    return { type: 'failure', reason: playerHeroIdResult.error } as const;
  }

  const opponentHeroIdResult = validateAndConvertToBigInt(data.opponentHeroId, 'opponentHeroId');
  if (!opponentHeroIdResult.success) {
    return { type: 'failure', reason: opponentHeroIdResult.error } as const;
  }

  const query = () => {
    // Generate UUID on application side
    const gameId = generateUUID();

    return db.game.create({
      data: {
        id: gameId,
        matchId: data.matchId,
        playerHeroId: playerHeroIdResult.data!,
        opponentHeroId: opponentHeroIdResult.data!,
        gameStatus: data.gameStatus,
        comment: data.comment?.slice(0, 500),
      },
      include: {
        playerHero: {
          include: {
            faction: true,
          },
        },
        opponentHero: {
          include: {
            faction: true,
          },
        },
      },
    });
  };

  return withResult(query, 'Error while creating game');
};

export const getMatchWithGames = async (matchId: string) => {
  const query = () => {
    return db.match.findUnique({
      where: { id: matchId },
      include: {
        games: {
          include: {
            playerHero: {
              include: {
                faction: true,
              },
            },
            opponentHero: {
              include: {
                faction: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        player: true,
        opponent: true,
        season: true,
        event: true,
      },
    });
  };

  return withResult(query, 'Error while fetching match with games');
};

export const updateMatchStatus = async (matchId: string, status: 'WIN' | 'LOSS' | 'DRAW') => {
  const query = () => {
    return db.match.update({
      where: { id: matchId },
      data: { matchStatus: status },
    });
  };

  return withResult(query, 'Error while updating match status');
};

export const getPlayerMatchesWithGames = async (playerId: string) => {
  const playerIdResult = validateAndConvertToBigInt(playerId, 'playerId');
  if (!playerIdResult.success) {
    return { type: 'failure', reason: playerIdResult.error } as const;
  }

  const query = () => {
    return db.match.findMany({
      where: { playerId: playerIdResult.data! },
      include: {
        games: {
          include: {
            playerHero: {
              include: {
                faction: true,
              },
            },
            opponentHero: {
              include: {
                faction: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        season: true,
        event: true,
      },
      orderBy: [{ season: { startDate: 'desc' } }, { createdAt: 'desc' }],
    });
  };

  return withResult(query, 'Error while fetching player matches');
};

export const getPaginatedPlayerMatches = async ({
  playerId,
  page,
  query,
}: {
  playerId: string;
  page: number;
  query: string;
}): Promise<{
  items: (Match & {
    games: Game[];
    season: { id: bigint; name: string; startDate: Date; endDate: Date };
    event: { id: bigint; name: string; eventType: string } | null;
  })[];
  totalPages: number;
}> => {
  const playerIdResult = validateAndConvertToBigInt(playerId, 'playerId');
  if (!playerIdResult.success) {
    throw new Error(playerIdResult.error);
  }

  const PAGE_SIZE = PAGINATION.MATCH;
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    playerId: playerIdResult.data!,
    ...(query.trim() && {
      OR: [
        { opponentName: { contains: query, mode: 'insensitive' as const } },
        { season: { name: { contains: query, mode: 'insensitive' as const } } },
        { event: { name: { contains: query, mode: 'insensitive' as const } } },
        { comment: { contains: query, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [items, totalCount] = await Promise.all([
    db.match.findMany({
      where,
      include: {
        games: {
          include: {
            playerHero: {
              include: {
                faction: true,
              },
            },
            opponentHero: {
              include: {
                faction: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        season: true,
        event: true,
      },
      orderBy: [{ season: { startDate: 'desc' } }, { createdAt: 'desc' }],
      skip,
      take: PAGE_SIZE,
    }),
    db.match.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    items,
    totalPages,
  };
};

export const deleteMatch = async (matchId: string, playerId: string) => {
  const playerIdResult = validateAndConvertToBigInt(playerId, 'playerId');
  if (!playerIdResult.success) {
    return { type: 'failure', reason: playerIdResult.error } as const;
  }

  const query = async () => {
    // Check if the match belongs to the player
    const match = await db.match.findFirst({
      where: {
        id: matchId,
        playerId: playerIdResult.data!,
      },
    });

    if (!match) {
      throw new Error('Match non trouvé ou accès non autorisé');
    }

    // Delete all games associated with the match first
    await db.game.deleteMany({
      where: {
        matchId: matchId,
      },
    });

    // Then delete the match
    await db.match.delete({
      where: {
        id: matchId,
      },
    });
  };

  return withResult(query, 'Error while deleting match');
};

export const deleteGame = async (gameId: string, playerId: string) => {
  const playerIdResult = validateAndConvertToBigInt(playerId, 'playerId');
  if (!playerIdResult.success) {
    return { type: 'failure', reason: playerIdResult.error } as const;
  }

  const query = async () => {
    const game = await db.game.findFirst({
      where: {
        id: gameId,
        match: {
          playerId: playerIdResult.data!,
        },
      },
      include: {
        match: true,
      },
    });

    if (!game) {
      throw new Error('Game non trouvée ou accès non autorisé');
    }

    if (game.match.matchStatus !== 'IN_PROGRESS') {
      throw new Error("Impossible de supprimer une game d'un match clôturé");
    }

    await db.game.delete({
      where: {
        id: gameId,
      },
    });
  };

  return withResult(query, 'Error while deleting game');
};
