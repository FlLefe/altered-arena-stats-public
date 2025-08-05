'use client';

import { EditModal } from '@/client/components/shared';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { deleteGameAction } from '@/server/features/game/deleteGameAction';
import { Game } from '@/types';

type Props = {
  game: Game;
  gameNumber: number;
  onClose: () => void;
  onGameDeleted?: () => void;
};

export function DeleteGameModal({ game, gameNumber, onClose, onGameDeleted }: Props) {
  const { handleError, handleSuccess } = useErrorHandler();

  const handleDelete = async () => {
    try {
      const result = await deleteGameAction({ gameId: game.id });

      if (!result.success) {
        throw new Error(result.error);
      }

      handleSuccess('Game supprimée avec succès');
      onGameDeleted?.();
    } catch (error) {
      handleError(error instanceof Error ? error.message : "Une erreur inattendue s'est produite");
    }
  };

  return (
    <EditModal
      title={`Supprimer la game ${gameNumber}`}
      open={true}
      onClose={onClose}
      onSubmit={handleDelete}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground">Êtes-vous sûr de vouloir supprimer cette game ?</p>

        <div className="bg-muted p-4 rounded-lg">
          <p className="font-medium">
            Game {gameNumber} - {game.playerHero.name} vs {game.opponentHero.name}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Cette action est irréversible.</p>
        </div>
      </div>
    </EditModal>
  );
}
