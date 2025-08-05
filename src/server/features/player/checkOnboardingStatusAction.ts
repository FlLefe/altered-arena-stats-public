'use server';

import { db } from '@/lib/prisma';
import { isFailure } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';

export async function checkOnboardingStatusAction() {
  try {
    const session = await getFullUserSession();
    if (isFailure(session) || !session.data) {
      return { success: false, error: 'Utilisateur non authentifié', code: 'UNAUTHORIZED' };
    }

    const player = await db.player.findUnique({
      where: {
        authId: session.data.authId,
        deletedAt: null,
      },
    });

    if (!player) {
      return { success: false, error: 'Joueur non trouvé', code: 'NOT_FOUND' };
    }

    return {
      success: true,
      data: {
        profileComplete: player.profileComplete,
        hasAlias:
          !!player.alteredAlias &&
          player.alteredAlias !== 'Player_' + player.alteredAlias.substring(7, 15),
      },
    };
  } catch (error) {
    console.error('[checkOnboardingStatusAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
