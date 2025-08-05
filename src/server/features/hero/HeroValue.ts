import { type Hero, type Faction } from '@prisma/client';
import { mapFactionToDTO } from '../faction/FactionValue';
import { PaginatedHeroDTO } from './HeroDTO';

type PrismaHero = Hero & { faction: Faction; imageUrl: string | null };

export function mapHeroToDTO(hero: PrismaHero): PaginatedHeroDTO {
  return {
    id: hero.id.toString(),
    name: hero.name,
    faction: mapFactionToDTO(hero.faction),
    imageUrl: hero.imageUrl,
    createdAt: hero.createdAt.toISOString(),
    updatedAt: hero.updatedAt.toISOString(),
  };
}

export function mapHeroToPaginatedDTO(hero: PrismaHero): PaginatedHeroDTO {
  return mapHeroToDTO(hero);
}
