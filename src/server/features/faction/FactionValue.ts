import { type Faction } from '@prisma/client';
import { BaseFactionDTO, PaginatedFactionDTO } from './FactionDTO';

export function mapFactionToDTO(faction: Faction): BaseFactionDTO {
  return {
    id: faction.id.toString(),
    name: faction.name,
    colorCode: faction.colorCode,
    createdAt: faction.createdAt.toISOString(),
    updatedAt: faction.updatedAt.toISOString(),
  };
}

export function mapFactionToPaginatedDTO(faction: Faction): PaginatedFactionDTO {
  return mapFactionToDTO(faction);
}
