'use client';

import { useState } from 'react';
import { useDeleteEntity } from '@/client/hooks';
import { Button } from '@/components/ui/button';
import { PaginatedFactionDTO } from '@/server/features/faction/FactionDTO';
import { deleteFactionAction } from '@/server/features/faction/deleteFactionAction';
import { EditFactionModal } from './EditFactionModal';

type Props = {
  factions: PaginatedFactionDTO[];
  isLoading: boolean;
  onDelete?: () => void;
};

export function FactionTable({ factions, isLoading, onDelete }: Props) {
  const [selectedFaction, setSelectedFaction] = useState<PaginatedFactionDTO | null>(null);

  const { handleDelete, isPending: isDeleting } = useDeleteEntity(deleteFactionAction, {
    onSuccessMessage: 'Faction supprimée avec succès.',
    onErrorMessage: 'Impossible de supprimer cette faction.',
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!factions || factions.length === 0)
    return <p className="text-muted-foreground">Aucune faction trouvée.</p>;

  return (
    <>
      <div className="space-y-2">
        {factions.map((faction) => (
          <div
            key={faction.id}
            className="p-4 rounded border text-foreground bg-surface shadow-sm sm:grid sm:grid-cols-4 sm:items-center"
          >
            <div className="font-bold text-foreground">{faction.name}</div>
            <div className="text-sm text-foreground">{faction.colorCode}</div>
            <div className="text-xs text-muted-foreground">
              Créée le {new Date(faction.createdAt).toLocaleDateString()}
            </div>
            <div className="flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <Button size="sm" onClick={() => setSelectedFaction(faction)}>
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(faction.id, onDelete)}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedFaction && (
        <EditFactionModal
          faction={selectedFaction}
          open={true}
          onClose={() => setSelectedFaction(null)}
          onUpdated={() => {
            setSelectedFaction(null);
            onDelete?.();
          }}
        />
      )}
    </>
  );
}
