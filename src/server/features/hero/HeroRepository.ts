import { PAGINATION } from '@/constants';
import { db } from '@/lib/prisma';
import { type Result } from '@/lib/result';
import { withResult } from '@/lib/withResult';
import { BaseHeroDTO, CreateHeroDTO, PaginatedHeroDTO, UpdateHeroDTO } from './HeroDTO';
import { mapHeroToDTO, mapHeroToPaginatedDTO } from './HeroValue';

const PAGE_SIZE = PAGINATION.HERO;

export const getAllHeroes = (): Promise<Result<BaseHeroDTO[]>> => {
  const query = async () => {
    const heroes = await db.hero.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        faction: true,
      },
    });

    const dtoList = heroes.map(mapHeroToDTO);
    return BaseHeroDTO.array().parse(dtoList);
  };

  return withResult(query, 'Error while fetching heroes');
};

export const deleteHero = (id: string): Promise<Result<true>> => {
  const query = db.hero
    .delete({
      where: { id: BigInt(id) },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while deleting hero');
};

export const updateHero = (params: { id: string; data: UpdateHeroDTO }): Promise<Result<true>> => {
  const { id, data } = params;

  const query = db.hero
    .update({
      where: { id: BigInt(id) },
      data: {
        name: data.name,
        factionId: BigInt(data.factionId),
        imageUrl: data.imageUrl || null,
      },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while updating hero');
};

export const createHero = (data: CreateHeroDTO): Promise<Result<true>> => {
  const query = db.hero
    .create({
      data: {
        name: data.name,
        factionId: BigInt(data.factionId),
        imageUrl: data.imageUrl || null,
      },
    })
    .then(() => true as const);

  return withResult(() => query, 'Error while creating hero');
};

export const getHeroesBySearch = async ({
  page,
  query,
}: {
  page: number;
  query: string;
}): Promise<{ items: PaginatedHeroDTO[]; totalPages: number }> => {
  const [heroes, totalCount] = await Promise.all([
    db.hero.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        faction: true,
      },
    }),
    db.hero.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    }),
  ]);

  const items = heroes.map(mapHeroToPaginatedDTO);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    items,
    totalPages,
  };
};
