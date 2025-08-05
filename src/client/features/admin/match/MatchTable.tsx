'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntities } from '@/lib/sanitization';
import { AdminMatchDTO } from '@/server/features';
import { deleteMatchAdminAction } from '@/server/features/match/deleteMatchAdminAction';

type Props = {
  matches: AdminMatchDTO[];
  isLoading: boolean;
  onDelete?: () => void;
};

export function MatchTable({ matches, isLoading, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (matchId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteMatchAdminAction({ matchId });
      if (result.success) {
        toast.success('Match supprimé avec succès.');
        onDelete?.();
      } else {
        toast.error(result.error || 'Impossible de supprimer ce match.');
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
      IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    } as const;

    const getStatusText = (status: string) => {
      switch (status) {
        case 'WIN':
          return 'Victoire';
        case 'LOSS':
          return 'Défaite';
        case 'DRAW':
          return 'Égalité';
        case 'IN_PROGRESS':
          return 'En cours';
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

  const getTypeBadge = (type: string) => {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
        {type === 'TOURNAMENT' ? 'Tournoi' : 'Amical'}
      </span>
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!matches || matches.length === 0)
    return <p className="text-muted-foreground">Aucun match trouvé.</p>;

  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <div key={match.id} className="p-4 rounded border text-foreground bg-surface shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Main information */}
            <div className="space-y-2">
              <div className="font-semibold text-foreground">
                {match.player?.alteredAlias || 'Joueur inconnu'}
              </div>
              <div className="text-sm text-muted-foreground">
                vs {match.opponentName || 'Adversaire inconnu'}
              </div>
              <div className="flex gap-2">
                {getStatusBadge(match.matchStatus)}
                {getTypeBadge(match.matchType)}
              </div>
            </div>

            {/* Format and details */}
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Format:</span> {match.matchFormat}
              </div>
              <div className="text-sm">
                <span className="font-medium">Saison:</span> {match.season.name}
              </div>
              {match.event && (
                <div className="text-sm">
                  <span className="font-medium">Événement:</span> {match.event.name}
                </div>
              )}
            </div>

            {/* Statistics and comments */}
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Games:</span> {match._count.games}
              </div>
              <div className="text-sm text-muted-foreground">
                Créé le{' '}
                {new Date(match.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              {match.comment && (
                <div className="text-sm">
                  <span className="font-medium">Commentaire:</span>
                  <div
                    className="mt-1 p-2 bg-muted rounded text-xs"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    &ldquo;{decodeHtmlEntities(match.comment)}&rdquo;
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(match.id)}
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
