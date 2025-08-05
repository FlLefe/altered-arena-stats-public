'use client';

import { useState } from 'react';
import { useDeleteEntity } from '@/client/hooks';
import { Button } from '@/components/ui/button';
import { PaginatedSeasonDTO, deleteSeasonAction } from '@/server/features/season';
import { EditSeasonModal } from './EditSeasonModal';

type Props = {
  seasons: PaginatedSeasonDTO[];
  isLoading: boolean;
  onDelete?: () => void;
};

export function SeasonTable({ seasons, isLoading, onDelete }: Props) {
  const [selectedSeason, setSelectedSeason] = useState<PaginatedSeasonDTO | null>(null);

  const { handleDelete, isPending: isDeleting } = useDeleteEntity(deleteSeasonAction, {
    onSuccessMessage: 'Saison supprimée avec succès.',
    onErrorMessage: 'Impossible de supprimer cette saison.',
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!seasons || seasons.length === 0)
    return <p className="text-muted-foreground">Aucune saison trouvée.</p>;

  return (
    <>
      <div className="space-y-2">
        {seasons.map((season) => (
          <div
            key={season.id}
            className="p-4 rounded border text-foreground bg-surface shadow-sm sm:grid sm:grid-cols-4 sm:items-center"
          >
            <div className="font-bold text-foreground">{season.name}</div>
            <div className="text-sm text-foreground">
              Du {new Date(season.startDate).toLocaleDateString()} au{' '}
              {new Date(season.endDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Créée le {new Date(season.createdAt).toLocaleDateString()}
            </div>
            <div className="flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <Button size="sm" onClick={() => setSelectedSeason(season)}>
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(season.id, onDelete)}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedSeason && (
        <EditSeasonModal
          season={selectedSeason}
          open={true}
          onClose={() => setSelectedSeason(null)}
          onUpdated={() => {
            setSelectedSeason(null);
            onDelete?.();
          }}
        />
      )}
    </>
  );
}
