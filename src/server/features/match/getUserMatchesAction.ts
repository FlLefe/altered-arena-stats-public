'use server';

import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { getPlayerMatchesWithGames } from '../game/GameRepository';
import { transformMatchToPaginatedDTO } from './MatchValue';
import type { MatchWithRelations } from './MatchValue';

export async function getUserMatchesAction() {
  try {
    // 1. Validate authentication
    const session = await getFullUserSession();
    if (isFailure(session)) {
      throw new Error('Utilisateur non authentifié');
    }

    const playerData = session.data;

    // 2. Get player matches
    const result = await getPlayerMatchesWithGames(playerData.id.toString());

    if (isFailure(result)) {
      throw new Error(result.reason);
    }

    // 3. Map to DTOs
    const matchesDTO = (result as unknown as { data: MatchWithRelations[] }).data.map((item) =>
      transformMatchToPaginatedDTO(item),
    );

    return matchesDTO;
  } catch (error) {
    console.error('[getUserMatchesAction]', error);
    throw error;
  }
}
