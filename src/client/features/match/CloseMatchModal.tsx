'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { Button } from '@/components/ui/button';
import { updateMatchStatusAction } from '@/server/features/game/updateMatchStatusAction';
import { PaginatedMatchDTO } from '@/server/features/match';
import { MatchWithGames } from '@/types/match';

type Props = {
  match: MatchWithGames | PaginatedMatchDTO;
  onClose: () => void;
  onMatchClosed?: () => void;
};

export function CloseMatchModal({ match, onClose, onMatchClosed }: Props) {
  const [status, setStatus] = useState<'WIN' | 'LOSS' | 'DRAW'>('WIN');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { handleError, handleSuccess } = useErrorHandler();

  const handleClose = async () => {
    setLoading(true);

    try {
      const result = await updateMatchStatusAction({
        data: {
          matchId: match.id,
          status,
        },
      });

      if (!result.success) {
        handleError(result.error || "Une erreur s'est produite");
        return;
      }

      handleSuccess('Match clôturé avec succès');
      onClose();
      onMatchClosed?.();
      router.refresh();
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
          <Dialog.Title className="text-lg font-bold">Clôturer le match</Dialog.Title>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Contre {match.opponentName || 'Adversaire inconnu'} - {match.season.name}
            </p>

            <div className="space-y-3">
              <p className="font-medium">Choisir le résultat final :</p>
              <div className="flex gap-2">
                <Button
                  variant="status"
                  onClick={() => setStatus('WIN')}
                  className={`flex-1 transition-colors ${
                    status === 'WIN'
                      ? 'bg-success border-success text-white hover:bg-success/90'
                      : 'bg-success/20 border-success text-success hover:bg-success/30'
                  }`}
                >
                  Victoire
                </Button>
                <Button
                  variant="status"
                  onClick={() => setStatus('LOSS')}
                  className={`flex-1 transition-colors ${
                    status === 'LOSS'
                      ? 'bg-error border-error text-white hover:bg-error/90'
                      : 'bg-error/20 border-error text-error hover:bg-error/30'
                  }`}
                >
                  Défaite
                </Button>
                <Button
                  variant="status"
                  onClick={() => setStatus('DRAW')}
                  className={`flex-1 transition-colors ${
                    status === 'DRAW'
                      ? 'bg-warning border-warning text-white hover:bg-warning/90'
                      : 'bg-warning/20 border-warning text-warning hover:bg-warning/30'
                  }`}
                >
                  Égalité
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">Annuler</Button>
            </Dialog.Close>
            <Button onClick={handleClose} disabled={loading}>
              {loading ? 'Clôture...' : 'Clôturer'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
