import { type Season } from '@prisma/client';
import { BaseSeasonDTO, PaginatedSeasonDTO } from './SeasonDTO';

export function mapSeasonToDTO(season: Season): BaseSeasonDTO {
  return {
    id: season.id.toString(),
    name: season.name,
    startDate: season.startDate.toISOString(),
    endDate: season.endDate.toISOString(),
    createdAt: season.createdAt.toISOString(),
    updatedAt: season.updatedAt.toISOString(),
  };
}

export function mapSeasonToPaginatedDTO(season: Season): PaginatedSeasonDTO {
  return {
    id: season.id.toString(),
    name: season.name,
    startDate: season.startDate.toISOString(),
    endDate: season.endDate.toISOString(),
    createdAt: season.createdAt.toISOString(),
  };
}
