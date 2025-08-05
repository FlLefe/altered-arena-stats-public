'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FactionIcon } from '@/client/components/FactionIcon';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntities } from '@/lib/sanitization';
import { PaginatedGameDTO } from '@/server/features/game';
import { deleteGameAction } from '@/server/features/game/deleteGameAction';

type Props = {
  games: PaginatedGameDTO[];
  isLoading: boolean;
  onDelete?: () => void;
};

export function GameTable({ games, isLoading, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (gameId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteGameAction({ gameId });
      if (result.success) {
        toast.success('Game supprimée avec succès.');
        onDelete?.();
      } else {
        toast.error(result.error || 'Impossible de supprimer cette game.');
      }
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      WIN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      LOSS: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      DRAW: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    } as const;

    const getStatusText = (status: string) => {
      switch (status) {
        case 'WIN':
          return 'Victoire';
        case 'LOSS':
          return 'Défaite';
        case 'DRAW':
          return 'Égalité';
        default:
          return status;
      }
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
      >
        {getStatusText(status)}
      </span>
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!games || games.length === 0)
    return <p className="text-muted-foreground">Aucune game trouvée.</p>;

  return (
    <div className="space-y-2">
      {games.map((game) => (
        <div key={game.id} className="p-4 rounded border text-foreground bg-surface shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Main information */}
            <div className="space-y-2">
              <div className="font-semibold text-foreground">
                {game.match.player?.alteredAlias || 'Joueur inconnu'}
              </div>
              <div className="text-sm text-muted-foreground">
                vs {game.match.opponentName || 'Adversaire inconnu'}
              </div>
              <div className="flex gap-2">{getStatusBadge(game.gameStatus)}</div>
            </div>

            {/* Heroes */}
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Héros joueur:</span>
                <div className="flex items-center gap-2 mt-1">
                  <FactionIcon
                    factionName={game.playerHero.faction.name}
                    color={game.playerHero.faction.colorCode}
                    size="md"
                  />
                  {game.playerHero.name} ({game.playerHero.faction.name})
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Héros adversaire:</span>
                <div className="flex items-center gap-2 mt-1">
                  <FactionIcon
                    factionName={game.opponentHero.faction.name}
                    color={game.opponentHero.faction.colorCode}
                    size="md"
                  />
                  {game.opponentHero.name} ({game.opponentHero.faction.name})
                </div>
              </div>
            </div>

            {/* Context and comments */}
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Saison:</span> {game.match.season.name}
              </div>
              {game.match.event && (
                <div className="text-sm">
                  <span className="font-medium">Événement:</span> {game.match.event.name}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Créée le{' '}
                {new Date(game.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              {game.comment && (
                <div className="text-sm">
                  <span className="font-medium">Commentaire:</span>
                  <div className="text-muted-foreground mt-1 p-2 bg-muted rounded text-xs">
                    &ldquo;{decodeHtmlEntities(game.comment)}&rdquo;
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(game.id)}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
