import { PAGINATION } from '@/constants';
import { db } from '@/lib/prisma';
import { type Result } from '@/lib/result';
import { withResult } from '@/lib/withResult';
import {
  BaseFactionDTO,
  CreateFactionDTO,
  PaginatedFactionDTO,
  UpdateFactionDTO,
} from './FactionDTO';
import { mapFactionToDTO, mapFactionToPaginatedDTO } from './FactionValue';

const PAGE_SIZE = PAGINATION.FACTION;

export const getAllFactions = (): Promise<Result<BaseFactionDTO[]>> => {
  const query = async () => {
    const factions = await db.faction.findMany({
      orderBy: { name: 'asc' },
    });

    const dtoList = factions.map(mapFactionToDTO);
    return BaseFactionDTO.array().parse(dtoList);
  };

  return withResult(query, 'Error while fetching factions');
};

export const deleteFaction = (id: string): Promise<Result<true>> => {
  const query = db.faction
    .delete({
      where: { id: BigInt(id) },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while deleting faction');
};

export const updateFaction = (params: {
  id: string;
  data: UpdateFactionDTO;
}): Promise<Result<true>> => {
  const { id, data } = params;

  const query = db.faction
    .update({
      where: { id: BigInt(id) },
      data: {
        name: data.name,
        colorCode: data.colorCode,
      },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while updating faction');
};

export const createFaction = (data: CreateFactionDTO): Promise<Result<true>> => {
  const query = db.faction
    .create({
      data: {
        name: data.name,
        colorCode: data.colorCode,
      },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while creating faction');
};

export const getFactionsBySearch = async ({
  page,
  query,
}: {
  page: number;
  query: string;
}): Promise<{ items: PaginatedFactionDTO[]; totalPages: number }> => {
  const [items, totalCount] = await Promise.all([
    db.faction.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.faction.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    items: items.map(mapFactionToPaginatedDTO),
    totalPages,
  };
};
