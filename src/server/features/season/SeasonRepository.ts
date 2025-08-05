import { PAGINATION } from '@/constants';
import { db } from '@/lib/prisma';
import { type Result } from '@/lib/result';
import { withResult } from '@/lib/withResult';
import { parseDateString } from '@/utils/date';
import { BaseSeasonDTO, CreateSeasonDTO, PaginatedSeasonDTO, UpdateSeasonDTO } from './SeasonDTO';
import { mapSeasonToDTO, mapSeasonToPaginatedDTO } from './SeasonValue';

const PAGE_SIZE = PAGINATION.SEASON;

export const getAllSeasons = (): Promise<Result<BaseSeasonDTO[]>> => {
  const query = async () => {
    const seasons = await db.season.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });

    const dtoList = seasons.map(mapSeasonToDTO);
    return BaseSeasonDTO.array().parse(dtoList);
  };

  return withResult(query, 'Error while fetching seasons');
};

export const deleteSeason = (id: string): Promise<Result<true>> => {
  const query = db.season
    .update({
      where: { id: BigInt(id) },
      data: { updatedAt: new Date() },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while deleting season');
};

export const updateSeason = (params: {
  id: string;
  data: UpdateSeasonDTO;
}): Promise<Result<true>> => {
  const { id, data } = params;

  const query = db.season
    .update({
      where: { id: BigInt(id) },
      data: {
        name: data.name,
        startDate: parseDateString(data.startDate) || new Date(),
        endDate: parseDateString(data.endDate) || new Date(),
      },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while updating season');
};

export const createSeason = (data: CreateSeasonDTO): Promise<Result<true>> => {
  const query = db.season
    .create({
      data: {
        name: data.name,
        startDate: parseDateString(data.startDate) || new Date(),
        endDate: parseDateString(data.endDate) || new Date(),
      },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while creating season');
};

export const getSeasonsBySearch = async ({
  page,
  query,
}: {
  page: number;
  query: string;
}): Promise<{ items: PaginatedSeasonDTO[]; totalPages: number }> => {
  const [seasons, totalCount] = await Promise.all([
    db.season.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        startDate: 'desc',
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.season.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    }),
  ]);

  const items = seasons.map(mapSeasonToPaginatedDTO);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    items,
    totalPages,
  };
};
