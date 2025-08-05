import type { Prisma } from '@prisma/client';
import { PAGINATION } from '@/constants';
import { db } from '@/lib/prisma';
import { Result } from '@/lib/result';
import { withResult } from '@/lib/withResult';
import { PaginatedPlayerDTO, UpdatePlayerProfileDTO } from './PlayerDTO';
import { mapPlayerToDTO } from './PlayerValue';
import { anonymizePlayerMatches } from './anonymizePlayerMatches';

type UpdatePlayerProfileType = {
  alteredAlias?: string;
  favoriteFactionId?: string;
  favoriteHeroId?: string;
  profileComplete?: boolean;
};

const PAGE_SIZE = PAGINATION.PLAYER;

export const getPlayerMatches = (playerId: string) => {
  return withResult(async () => {
    return await db.match.findMany({
      where: {
        OR: [{ playerId: BigInt(playerId) }, { opponentId: BigInt(playerId) }],
      },
      select: {
        id: true,
        playerId: true,
        opponentId: true,
        opponentName: true,
      },
    });
  }, 'Error while fetching player matches');
};

export const checkAliasExists = (alias: string) => {
  return withResult(async () => {
    const existing = await db.player.findFirst({
      where: {
        alteredAlias: alias,
        deletedAt: null, // Exclude deleted users
      },
    });
    return Boolean(existing);
  }, 'Error while checking alias existence');
};

export const updateMatchAnonymization = (matchId: MatchId, updateData: Prisma.MatchUpdateInput) => {
  return withResult(async () => {
    return await db.match.update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { id: matchId as any },
      data: updateData,
    });
  }, 'Error while updating match anonymization');
};

export const deletePlayer = (id: string): Promise<Result<true>> => {
  const query = async () => {
    const anonymizeResult = await anonymizePlayerMatches(id);
    if (anonymizeResult.type === 'failure') {
      console.error('Failed to anonymize player matches:', anonymizeResult.reason);
    }

    // Soft delete player
    await db.player.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });

    return true as const;
  };

  return withResult(query, 'Error while deleting player');
};

export const updatePlayerProfile = (
  authId: string,
  { alteredAlias, favoriteFactionId, favoriteHeroId, profileComplete }: UpdatePlayerProfileType,
): Promise<Result<true>> => {
  const query = async () => {
    const existing = await db.player.findUnique({
      where: {
        authId,
        deletedAt: null, // Exclude deleted users
      },
    });

    if (!existing) {
      throw new Error('player_not_found');
    }

    const updateData: Prisma.PlayerUpdateInput = {};

    if (alteredAlias !== undefined) {
      updateData.alteredAlias = alteredAlias;
    }

    if (favoriteFactionId !== undefined) {
      if (favoriteFactionId && favoriteFactionId !== '') {
        updateData.favoriteFaction = { connect: { id: BigInt(favoriteFactionId) } };
      }
      // If undefined or empty string, do nothing (no update)
    }

    if (favoriteHeroId !== undefined) {
      if (favoriteHeroId && favoriteHeroId !== '') {
        updateData.favoriteHero = { connect: { id: BigInt(favoriteHeroId) } };
      }
      // If undefined or empty string, do nothing (no update)
    }

    if (profileComplete !== undefined) {
      updateData.profileComplete = profileComplete;
    }

    await db.player.update({
      where: { authId },
      data: updateData,
    });

    return true as const;
  };

  return withResult(query, 'Error while updating player data');
};

export const isAlteredAliasTaken = (
  alteredAlias: string,
  excludeAuthId?: string,
): Promise<Result<boolean>> => {
  const query = async () => {
    // Check if the alias exists (even for deleted users)
    const existing = await db.player.findFirst({
      where: {
        alteredAlias: {
          equals: alteredAlias,
          mode: 'insensitive', // Case insensitive
        },
        ...(excludeAuthId ? { NOT: { authId: excludeAuthId } } : {}),
      },
    });

    if (!existing) {
      return false; // The alias doesn't exist at all
    }

    // If the alias exists (even for a deleted user), it is considered taken
    // This avoids conflicts and allows for potential restoration
    return true; // Alias taken (active or deleted)
  };

  return withResult(query, 'Error while checking if altered alias is taken');
};

export const updatePlayerById = (
  id: string,
  data: UpdatePlayerProfileDTO,
): Promise<Result<true>> => {
  const query = async () => {
    const existing = await db.player.findUnique({ where: { id: BigInt(id) } });
    if (!existing) throw new Error('player_not_found');

    await db.player.update({
      where: { id: BigInt(id) },
      data: {
        alteredAlias: data.alteredAlias,
        favoriteFactionId: data.favoriteFactionId ? BigInt(data.favoriteFactionId) : undefined,
        favoriteHeroId: data.favoriteHeroId ? BigInt(data.favoriteHeroId) : undefined,
        role: data.role,
      },
    });

    return true as const;
  };

  return withResult(query, 'Error while updating player data');
};

export const getPlayersBySearch = async ({
  page,
  query,
  roleFilter,
  factionFilter,
  heroFilter,
}: {
  page: number;
  query: string;
  roleFilter?: string;
  factionFilter?: string;
  heroFilter?: string;
}): Promise<{ items: PaginatedPlayerDTO[]; totalPages: number }> => {
  // Build where clause
  const where: Prisma.PlayerWhereInput = {
    deletedAt: null,
  };

  // Add search query
  if (query.trim()) {
    where.alteredAlias = {
      contains: query,
      mode: 'insensitive',
    };
  }

  // Add role filter
  if (roleFilter && roleFilter !== 'all') {
    where.role = roleFilter as 'user' | 'admin';
  }

  // Add faction filter
  if (factionFilter && factionFilter !== 'all') {
    where.favoriteFaction = {
      id: BigInt(factionFilter),
    };
  }

  // Add hero filter
  if (heroFilter && heroFilter !== 'all') {
    where.favoriteHero = {
      id: BigInt(heroFilter),
    };
  }

  const [players, totalCount] = await Promise.all([
    db.player.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        favoriteFaction: true,
        favoriteHero: {
          include: {
            faction: true,
          },
        },
      },
    }),
    db.player.count({ where }),
  ]);

  const items = players.map(mapPlayerToDTO);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    items,
    totalPages,
  };
};

export const getPlayerByAuthId = (authId: string) => {
  return withResult(async () => {
    const player = await db.player.findUnique({
      where: {
        authId,
        deletedAt: null,
      },
      include: {
        favoriteFaction: true,
        favoriteHero: true,
      },
    });

    return player;
  }, 'Error while fetching player by authId');
};
