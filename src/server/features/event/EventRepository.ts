import { GENERIC_EVENT_NAMES, PAGINATION } from '@/constants';
import { db } from '@/lib/prisma';
import { type Result } from '@/lib/result';
import { withResult } from '@/lib/withResult';
import { parseDateString } from '@/utils/date';
import { validateAndConvertToBigInt } from '@/utils/index';
import { BaseEventDTO, CreateEventDTO, PaginatedEventDTO, UpdateEventDTO } from './EventDTO';
import { mapEventToDTO, mapEventToPaginatedDTO } from './EventValue';

const PAGE_SIZE = PAGINATION.EVENT;

export const getAllEvents = () => {
  return withResult(
    () =>
      db.event.findMany({
        where: { deleted: false },
        include: { season: true },
        orderBy: { createdAt: 'desc' },
      }),
    'Error while fetching events',
  );
};

export const getPaginatedEvents = (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        deleted: false,
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { season: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : { deleted: false };

  return withResult(
    () =>
      db.event.findMany({
        where,
        include: { season: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    'Error while fetching paginated events',
  );
};

export const getEventById = (id: string) => {
  const idResult = validateAndConvertToBigInt(id, 'eventId');
  if (!idResult.success) {
    return Promise.resolve({ type: 'failure', reason: idResult.error } as const);
  }

  return withResult(
    () =>
      db.event.findUnique({
        where: { id: idResult.data!, deleted: false },
        include: { season: true },
      }),
    'Error while fetching event',
  );
};

export const createEvent = (data: CreateEventDTO) => {
  const seasonIdResult = validateAndConvertToBigInt(data.seasonId, 'seasonId');
  if (!seasonIdResult.success) {
    return Promise.resolve({ type: 'failure', reason: seasonIdResult.error } as const);
  }

  const query = () =>
    db.event.create({
      data: {
        name: data.name,
        eventType: data.eventType,
        startDate: parseDateString(data.startDate),
        endDate: parseDateString(data.endDate),
        seasonId: seasonIdResult.data,
      },
      include: { season: true },
    });

  return withResult(query, 'Error while creating event');
};

export const updateEvent = (id: string, data: UpdateEventDTO) => {
  const eventId = BigInt(id);

  let seasonIdBigInt: bigint | null = null;
  if (data.seasonId !== undefined) {
    const seasonIdResult = validateAndConvertToBigInt(data.seasonId, 'seasonId');
    if (seasonIdResult.success) {
      seasonIdBigInt = seasonIdResult.data;
    }
  }

  const query = () =>
    db.event.update({
      where: { id: eventId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.eventType && { eventType: data.eventType }),
        ...(data.startDate !== undefined && {
          startDate: parseDateString(data.startDate),
        }),
        ...(data.endDate !== undefined && {
          endDate: parseDateString(data.endDate),
        }),
        ...(data.seasonId !== undefined && { seasonId: seasonIdBigInt }),
      },
      include: { season: true },
    });

  return withResult(query, 'Error while updating event');
};

export const deleteEvent = (id: string) => {
  const idResult = validateAndConvertToBigInt(id, 'eventId');
  if (!idResult.success) {
    return Promise.resolve({ type: 'failure', reason: idResult.error } as const);
  }

  const query = () =>
    db.event.update({
      where: { id: idResult.data! },
      data: { deleted: true },
    });

  return withResult(query, 'Error while deleting event');
};

export const getEventsBySearch = async ({
  page,
  query,
}: {
  page: number;
  query: string;
}): Promise<{ items: PaginatedEventDTO[]; totalPages: number }> => {
  const [items, totalCount] = await Promise.all([
    db.event.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' as const },
        deleted: false,
      },
      include: {
        season: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.event.count({
      where: {
        name: { contains: query, mode: 'insensitive' as const },
        deleted: false,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    items: items.map(mapEventToPaginatedDTO),
    totalPages,
  };
};

export const getGenericEvents = async (): Promise<Result<BaseEventDTO[]>> => {
  const query = async () => {
    const items = await db.event.findMany({
      where: {
        name: { in: GENERIC_EVENT_NAMES },
      },
      orderBy: { name: 'asc' },
    });

    return BaseEventDTO.array().parse(items.map(mapEventToDTO));
  };

  return withResult(query, 'Impossible de charger les tournois génériques');
};

export const getEventSuggestions = (search: string) => {
  return withResult(async () => {
    const items = await db.event.findMany({
      where: {
        deleted: false,
        name: { contains: search, mode: 'insensitive' as const },
      },
      select: { id: true, name: true, eventType: true },
      take: 10,
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      eventType: item.eventType,
    }));
  }, 'Error while fetching event suggestions');
};
