'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MatchWithGames } from '@/types';

type Props = {
  match: MatchWithGames;
  onCloseMatch: () => void;
  onDeleteMatch: () => void;
};

export const MatchActions = memo(function MatchActions({
  match,
  onCloseMatch,
  onDeleteMatch,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 pt-4 min-w-0">
      {match.matchStatus === 'IN_PROGRESS' ? (
        <>
          {/* First row: Add game + Close */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => router.push(`/dashboard/match/${match.id}/add-game`)}
              className="w-full h-12 text-center whitespace-nowrap"
            >
              Ajouter une partie
            </Button>
            <Button
              variant="outline"
              onClick={onCloseMatch}
              className="w-full h-12 text-center whitespace-nowrap"
            >
              Clôturer le match
            </Button>
          </div>
          {/* Second row: Delete (full width) */}
          <Button
            variant="destructive"
            onClick={onDeleteMatch}
            className="w-full h-12 text-center whitespace-nowrap"
          >
            Supprimer le match
          </Button>
        </>
      ) : (
        <Button
          variant="destructive"
          onClick={onDeleteMatch}
          className="w-full h-12 text-center whitespace-nowrap"
        >
          Supprimer le match
        </Button>
      )}
    </div>
  );
});
