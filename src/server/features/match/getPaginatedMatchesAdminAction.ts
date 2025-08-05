'use server';

import { PAGINATION } from '@/constants/pagination';
import { db } from '@/lib/prisma';
import { isAdminSession } from '@/server/features/auth';
import { isValidFrenchDate, parseFrenchDate } from '@/utils/date';
import { transformMatchToPaginatedDTO } from './MatchValue';

export async function getPaginatedMatchesAdminAction({
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

  const PAGE_SIZE = PAGINATION.MATCH;
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(query.trim() && {
      OR: [
        { opponentName: { contains: query, mode: 'insensitive' as const } },
        { player: { alteredAlias: { contains: query, mode: 'insensitive' as const } } },
        { season: { name: { contains: query, mode: 'insensitive' as const } } },
        { event: { name: { contains: query, mode: 'insensitive' as const } } },
        { comment: { contains: query, mode: 'insensitive' as const } },
        // Search by enum only if the value matches
        ...(query.toUpperCase() === 'TOURNAMENT' || query.toUpperCase() === 'FRIENDLY'
          ? [{ matchType: { equals: query.toUpperCase() as 'TOURNAMENT' | 'FRIENDLY' } }]
          : []),
        ...(query.toUpperCase() === 'BO1' ||
        query.toUpperCase() === 'BO3' ||
        query.toUpperCase() === 'BO5' ||
        query.toUpperCase() === 'BO7' ||
        query.toUpperCase() === 'BO9'
          ? [
              {
                matchFormat: {
                  equals: query.toUpperCase() as 'BO1' | 'BO3' | 'BO5' | 'BO7' | 'BO9',
                },
              },
            ]
          : []),
        ...(query.toUpperCase() === 'WIN' ||
        query.toUpperCase() === 'LOSS' ||
        query.toUpperCase() === 'DRAW' ||
        query.toUpperCase() === 'IN_PROGRESS'
          ? [
              {
                matchStatus: {
                  equals: query.toUpperCase() as 'WIN' | 'LOSS' | 'DRAW' | 'IN_PROGRESS',
                },
              },
            ]
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
      db.match.findMany({
        where,
        include: {
          player: {
            select: {
              id: true,
              alteredAlias: true,
              authId: true,
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
          _count: {
            select: {
              games: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
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

  try {
    const { items, totalPages } = await queryFn();

    // Transform Prisma data to DTO
    const transformedItems = items.map(transformMatchToPaginatedDTO);

    return {
      success: true,
      data: {
        items: transformedItems,
        totalPages,
      },
    };
  } catch (error) {
    console.error('[getPaginatedMatchesAdminAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
