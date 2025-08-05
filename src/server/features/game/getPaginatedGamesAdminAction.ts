'use server';

import { PAGINATION } from '@/constants/pagination';
import { db } from '@/lib/prisma';
import { isAdminSession } from '@/server/features/auth';
import { isValidFrenchDate, parseFrenchDate } from '@/utils/date';
import { transformGameToPaginatedDTO } from './GameValue';

export async function getPaginatedGamesAdminAction({
  page,
  query,
}: {
  page: number;
  query: string;
}) {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Accès non autorisé', code: 'UNAUTHORIZED' };
  }

  const PAGE_SIZE = PAGINATION.GAME;
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(query.trim() && {
      OR: [
        { match: { opponentName: { contains: query, mode: 'insensitive' as const } } },
        { match: { player: { alteredAlias: { contains: query, mode: 'insensitive' as const } } } },
        { match: { season: { name: { contains: query, mode: 'insensitive' as const } } } },
        { match: { event: { name: { contains: query, mode: 'insensitive' as const } } } },
        { comment: { contains: query, mode: 'insensitive' as const } },
        { playerHero: { name: { contains: query, mode: 'insensitive' as const } } },
        { opponentHero: { name: { contains: query, mode: 'insensitive' as const } } },
        // Search by enum only if the value matches
        ...(query.toUpperCase() === 'WIN' ||
        query.toUpperCase() === 'LOSS' ||
        query.toUpperCase() === 'DRAW'
          ? [{ gameStatus: { equals: query.toUpperCase() as 'WIN' | 'LOSS' | 'DRAW' } }]
          : []),
        // Search by creation date (format DD-MM-YYYY)
        ...(isValidFrenchDate(query)
          ? [
              {
                createdAt: {
                  gte: parseFrenchDate(query),
                  lte: new Date(parseFrenchDate(query).getTime() + 24 * 60 * 60 * 1000),
                },
              },
            ]
          : []),
      ],
    }),
  };

  const queryFn = async () => {
    const [items, totalCount] = await Promise.all([
      db.game.findMany({
        where,
        include: {
          match: {
            include: {
              player: {
                select: {
                  id: true,
                  alteredAlias: true,
                },
              },
              season: {
                select: {
                  id: true,
                  name: true,
                  startDate: true,
                  endDate: true,
                },
              },
              event: {
                select: {
                  id: true,
                  name: true,
                  eventType: true,
                },
              },
            },
          },
          playerHero: {
            include: {
              faction: {
                select: {
                  id: true,
                  name: true,
                  colorCode: true,
                },
              },
            },
          },
          opponentHero: {
            include: {
              faction: {
                select: {
                  id: true,
                  name: true,
                  colorCode: true,
                },
              },
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: PAGE_SIZE,
      }),
      db.game.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return {
      items,
      totalPages,
    };
  };

  try {
    const { items, totalPages } = await queryFn();

    // Transform Prisma data to DTO
    const transformedItems = items.map(transformGameToPaginatedDTO);

    return {
      success: true,
      data: {
        items: transformedItems,
        totalPages,
      },
    };
  } catch (error) {
    console.error('[getPaginatedGamesAdminAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
