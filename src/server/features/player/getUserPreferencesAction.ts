'use server';

import { db } from '@/lib/prisma';
import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { mapFactionToDTO } from '../faction/FactionValue';
import { mapHeroToDTO } from '../hero/HeroValue';

type UserPreferences = {
  alteredAlias: string;
  role: 'user' | 'admin';
  favoriteFaction: ReturnType<typeof mapFactionToDTO> | null;
  favoriteHero: ReturnType<typeof mapHeroToDTO> | null;
};

export async function getUserPreferencesAction(): Promise<UserPreferences | null> {
  try {
    const session = await getFullUserSession();
    if (isFailure(session)) {
      return null;
    }

    const player = await db.player.findUnique({
      where: {
        authId: session.data.authId,
        deletedAt: null,
      },
      select: {
        alteredAlias: true,
        role: true,
        favoriteFaction: true,
        favoriteHero: {
          include: {
            faction: true,
          },
        },
      },
    });

    if (!player) {
      return null;
    }

    return {
      alteredAlias: player.alteredAlias,
      role: player.role,
      favoriteFaction: player.favoriteFaction ? mapFactionToDTO(player.favoriteFaction) : null,
      favoriteHero: player.favoriteHero ? mapHeroToDTO(player.favoriteHero) : null,
    };
  } catch (error) {
    console.error('[getUserPreferencesAction]', error);
    return null;
  }
}
