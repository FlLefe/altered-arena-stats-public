'use server';

import { db } from '@/lib/prisma';
import { isAdminSession } from '@/server/features/auth';

type Params = {
  matchId: string;
};

export async function deleteMatchAdminAction({ matchId }: Params) {
  try {
    // Check if user is admin
    const isAdmin = await isAdminSession();
    if (!isAdmin) {
      return { success: false, error: 'Accès non autorisé', code: 'UNAUTHORIZED' };
    }

    // Delete all games associated with the match
    await db.game.deleteMany({
      where: {
        matchId: matchId,
      },
    });

    // Then delete the match
    await db.match.delete({
      where: {
        id: matchId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[deleteMatchAdminAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
