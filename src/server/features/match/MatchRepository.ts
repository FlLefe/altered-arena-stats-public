import { Prisma } from '@prisma/client';
import { MAX_IN_PROGRESS_MATCHES } from '@/constants';
import { db } from '@/lib/prisma';
import { generateUUID } from '@/lib/utils';
import { withResult } from '@/lib/withResult';
import { validateAndConvertToBigInt } from '@/utils/index';
import { type CreateMatchDTO } from './MatchDTO';

export const countInProgressMatchesByPlayer = (playerId: string) => {
  const playerIdResult = validateAndConvertToBigInt(playerId, 'playerId');
  if (!playerIdResult.success) {
    return { type: 'failure', reason: playerIdResult.error } as const;
  }

  return withResult(
    () =>
      db.match.count({
        where: {
          playerId: playerIdResult.data!,
          matchStatus: 'IN_PROGRESS',
        },
      }),
    'Error while counting in progress matches',
  );
};

export const createMatchDraft = async (playerId: string, matchData: CreateMatchDTO) => {
  // IDs validation
  const playerIdResult = validateAndConvertToBigInt(playerId, 'playerId');
  if (!playerIdResult.success) {
    return { type: 'failure', reason: playerIdResult.error } as const;
  }

  const seasonIdResult = validateAndConvertToBigInt(matchData.seasonId, 'seasonId');
  if (!seasonIdResult.success) {
    return { type: 'failure', reason: seasonIdResult.error } as const;
  }

  let eventIdBigInt: bigint | undefined;
  if (matchData.eventId) {
    const eventIdResult = validateAndConvertToBigInt(matchData.eventId, 'eventId');
    if (eventIdResult.success) {
      eventIdBigInt = eventIdResult.data || undefined;
    }
  }

  const inProgressCount = await countInProgressMatchesByPlayer(playerId);

  if (inProgressCount.type === 'failure') {
    return inProgressCount;
  }

  if (inProgressCount.data >= MAX_IN_PROGRESS_MATCHES) {
    return {
      type: 'failure',
      reason: `You already have ${MAX_IN_PROGRESS_MATCHES} matches in progress`,
    } as const;
  }

  const query = () => {
    // Generate UUID on application side
    const matchId = generateUUID();

    const data = {
      id: matchId,
      matchType: matchData.matchType,
      matchFormat: matchData.matchFormat,
      matchStatus: 'IN_PROGRESS' as const,
      comment: matchData.comment?.slice(0, 500),
      opponentName: matchData.opponentName,
      ...(seasonIdResult.data !== undefined &&
        seasonIdResult.data !== null && { seasonId: seasonIdResult.data }),
      ...(eventIdBigInt !== undefined && eventIdBigInt !== null && { eventId: eventIdBigInt }),
      ...(playerIdResult.data !== undefined &&
        playerIdResult.data !== null && { playerId: playerIdResult.data }),
    } as Prisma.MatchUncheckedCreateInput;

    return db.match.create({ data }).then((m) => m.id);
  };

  return withResult(query, 'Error while creating match draft');
};
