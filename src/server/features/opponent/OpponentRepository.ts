import { db } from '@/lib/prisma';
import { Result, ResultSuccess, ResultFailure } from '@/lib/result';
import { OpponentSuggestionDTO } from './OpponentDTO';
import { mapToOpponentSuggestionDTO } from './OpponentValue';

export async function getOpponentSuggestions(
  query: string,
): Promise<Result<OpponentSuggestionDTO[]>> {
  try {
    const cleanQuery = query.trim().toLowerCase();

    const [fromPlayers, fromNames] = await Promise.all([
      db.player.findMany({
        where: {
          alteredAlias: {
            contains: cleanQuery,
            mode: 'insensitive',
          },
          deletedAt: null,
        },
        select: {
          id: true,
          alteredAlias: true,
        },
        take: 5,
      }),

      db.match.findMany({
        where: {
          opponentId: null,
          opponentName: {
            contains: cleanQuery,
            mode: 'insensitive',
          },
        },
        distinct: ['opponentName'],
        select: {
          opponentName: true,
        },
        take: 10,
      }),
    ]);

    const result: OpponentSuggestionDTO[] = [
      ...fromPlayers.map(mapToOpponentSuggestionDTO),
      ...fromNames
        .map((m) => m.opponentName!)
        .filter(
          (name, i, arr) =>
            !fromPlayers.some((p) => p.alteredAlias === name) && arr.indexOf(name) === i,
        )
        .slice(0, 5)
        .map((name) => mapToOpponentSuggestionDTO({ id: null, name })),
    ];

    return ResultSuccess(result);
  } catch (error) {
    console.error('[getOpponentSuggestions]', error);
    return ResultFailure('Impossible de récupérer les suggestions d’adversaires');
  }
}
