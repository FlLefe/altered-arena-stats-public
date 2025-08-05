'use client';

import { useState } from 'react';
import { useDeleteEntity } from '@/client/hooks';
import { Button } from '@/components/ui/button';
import { deleteHeroAction, PaginatedHeroDTO } from '@/server/features/hero';
import { EditHeroModal } from './EditHeroModal';

type Props = {
  heroes: PaginatedHeroDTO[];
  isLoading: boolean;
  onDelete?: () => void;
};

export function HeroTable({ heroes, isLoading, onDelete }: Props) {
  const [selectedHero, setSelectedHero] = useState<PaginatedHeroDTO | null>(null);
  const { handleDelete, isPending: isDeleting } = useDeleteEntity(deleteHeroAction, {
    onSuccessMessage: 'Héros supprimé avec succès.',
    onErrorMessage: 'Impossible de supprimer ce héros.',
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!heroes || heroes.length === 0)
    return <p className="text-muted-foreground">Aucun héros trouvé.</p>;

  return (
    <>
      <div className="space-y-2">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className="p-4 rounded border text-foreground bg-surface shadow-sm sm:grid sm:grid-cols-3 sm:items-center"
          >
            <div className="font-bold text-foreground">{hero.name}</div>
            <div className="text-sm text-foreground">{hero.faction.name}</div>
            <div className="flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <Button size="sm" onClick={() => setSelectedHero(hero)}>
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(hero.id, onDelete)}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedHero && (
        <EditHeroModal
          hero={selectedHero}
          open={true}
          onClose={() => setSelectedHero(null)}
          onUpdated={() => {
            setSelectedHero(null);
            onDelete?.();
          }}
        />
      )}
    </>
  );
}
