'use client';

import { memo } from 'react';
import { MatchWithGames } from '@/types';
import { GameCard } from '../GameCard';

type Props = {
  match: MatchWithGames;
  totalGames: number;
  onGameDeleted: () => void;
};

export const MatchGamesList = memo(function MatchGamesList({
  match,
  totalGames,
  onGameDeleted,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">Parties</h2>
      {totalGames === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucune partie enregistrée pour ce match.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {match.games.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              gameNumber={index + 1}
              matchStatus={match.matchStatus}
              onGameDeleted={onGameDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
});
