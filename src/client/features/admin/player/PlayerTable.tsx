'use client';

import { useState } from 'react';
import { useDeleteEntity } from '@/client/hooks';
import { Button } from '@/components/ui/button';
import { PaginatedPlayerDTO } from '@/server/features/player';
import { deletePlayerAction } from '@/server/features/player/deletePlayerAction';
import { EditPlayerModal } from './EditPlayerModal';

type Props = {
  players: PaginatedPlayerDTO[];
  isLoading: boolean;
  onDelete?: () => void;
};

export function PlayerTable({ players, isLoading, onDelete }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<PaginatedPlayerDTO | null>(null);

  const { handleDelete, isPending: isDeleting } = useDeleteEntity(deletePlayerAction, {
    onSuccessMessage: 'Joueur supprimé avec succès.',
    onErrorMessage: 'Impossible de supprimer ce joueur.',
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!players || players.length === 0)
    return <p className="text-muted-foreground">Aucun joueur trouvé.</p>;

  return (
    <>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="p-4 rounded border text-foreground bg-surface shadow-sm sm:grid sm:grid-cols-5 sm:items-center"
          >
            <div>
              <div className="font-bold text-foreground">{player.alteredAlias}</div>
              <div className="text-xs text-foreground">{player.role}</div>
            </div>

            <div className="text-sm text-foreground">
              {player.favoriteFaction?.name || 'Aucune faction'}
            </div>

            <div className="text-sm text-foreground">
              {player.favoriteHero?.name || 'Aucun héros'}
            </div>

            <div className="text-xs text-muted-foreground">
              Créé le {new Date(player.createdAt).toLocaleDateString()}
            </div>

            <div className="flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <Button size="sm" onClick={() => setSelectedPlayer(player)}>
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(player.id, onDelete)}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <EditPlayerModal
          player={{
            id: selectedPlayer.id,
            authId: '', // Champ temporaire pour la compatibilité
            alteredAlias: selectedPlayer.alteredAlias,
            role: selectedPlayer.role,
            profileComplete: selectedPlayer.profileComplete,
          }}
          open={true}
          onClose={() => setSelectedPlayer(null)}
          onUpdated={() => {
            setSelectedPlayer(null);
            onDelete?.();
          }}
        />
      )}
    </>
  );
}
