import { type Player, type Faction, type Hero } from '@prisma/client';
import { mapFactionToDTO } from '../faction';
import { mapHeroToDTO } from '../hero';
import { PaginatedPlayerDTO, PlayerWithIdDTO } from './PlayerDTO';

type PrismaPlayer = Player & {
  favoriteFaction: Faction | null;
  favoriteHero: (Hero & { faction: Faction }) | null;
};

export function mapPlayerToDTO(player: PrismaPlayer): PaginatedPlayerDTO {
  return {
    id: player.id.toString(),
    alteredAlias: player.alteredAlias,
    role: player.role,
    favoriteFaction: player.favoriteFaction ? mapFactionToDTO(player.favoriteFaction) : null,
    favoriteHero: player.favoriteHero ? mapHeroToDTO(player.favoriteHero) : null,
    createdAt: player.createdAt.toISOString(),
    updatedAt: player.updatedAt.toISOString(),
    profileComplete: player.profileComplete,
  };
}

export function mapToPlayerWithId(input: unknown): PlayerWithIdDTO | null {
  const parsed = PlayerWithIdDTO.safeParse(input);
  return parsed.success ? parsed.data : null;
}
