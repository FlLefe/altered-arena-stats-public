'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { Button } from '@/components/ui/button';
import { PaginatedMatchDTO } from '@/server/features/match';
import { deleteMatchAction } from '@/server/features/match/deleteMatchAction';
import { MatchWithGames } from '@/types/match';

type Props = {
  match: MatchWithGames | PaginatedMatchDTO;
  onClose: () => void;
  onMatchDeleted?: () => void;
};

export function DeleteMatchModal({ match, onClose, onMatchDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const handleDelete = async () => {
    setLoading(true);

    try {
      const result = await deleteMatchAction({ matchId: match.id });

      if (!result.success) {
        throw new Error(result.error);
      }

      handleSuccess('Match supprimé avec succès');
      onClose();
      onMatchDeleted?.();
    } catch (error) {
      handleError(error instanceof Error ? error.message : "Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-overlay z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface border border-border p-6 shadow-lg space-y-4 text-foreground z-50">
          <Dialog.Title className="text-lg font-bold text-destructive">
            Supprimer le match
          </Dialog.Title>

          <div className="space-y-4">
            <p className="text-muted-foreground">Êtes-vous sûr de vouloir supprimer ce match ?</p>

            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">
                Contre {match.opponentName || 'Adversaire inconnu'} - {match.season.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Cette action est irréversible et supprimera également toutes les parties associées.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">Annuler</Button>
            </Dialog.Close>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
