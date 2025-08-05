import type { Prisma } from '@prisma/client';
import { withResult } from '@/lib/withResult';
import { generateUniqueAnonymousAlias } from '@/utils/anonymization';
import { getPlayerMatches, checkAliasExists, updateMatchAnonymization } from './PlayerRepository';

export const anonymizePlayerMatches = (playerId: string) => {
  return withResult(async () => {
    // 1. Get all matches where the player is involved
    const matchesResult = await getPlayerMatches(playerId);
    if (matchesResult.type === 'failure') {
      return matchesResult;
    }
    const matches = matchesResult.data;

    // 2. Generate a unique anonymous alias for this player
    const checkAliasExistsFn = async (alias: string) => {
      const result = await checkAliasExists(alias);
      return result.type === 'success' ? result.data : false;
    };

    const anonymousAlias = await generateUniqueAnonymousAlias(checkAliasExistsFn);

    // 3. Anonymize matches
    for (const match of matches) {
      const updateData: Prisma.MatchUncheckedUpdateInput = {};

      // If the player is the main player of the match
      if (match.playerId === BigInt(playerId)) {
        updateData.playerId = undefined; // Remove the reference
        updateData.opponentName = anonymousAlias; // Replace with the anonymous alias
      }

      // If the player is the opponent of the match
      if (match.opponentId === BigInt(playerId)) {
        updateData.opponentId = undefined; // Remove the reference
        updateData.opponentName = anonymousAlias; // Replace with the anonymous alias
      }

      // Update the match
      if (Object.keys(updateData).length > 0) {
        const updateResult = await updateMatchAnonymization(match.id.toString(), updateData);
        if (updateResult.type === 'failure') {
          console.error('Failed to update match:', updateResult.reason);
        }
      }
    }

    return true as const;
  }, 'Error while anonymizing player matches');
};
