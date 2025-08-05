'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { GameProgressIndicator } from '@/client/features/game/GameProgressIndicator';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntities } from '@/lib/sanitization';
import { PaginatedMatchDTO } from '@/server/features/match';
import { CloseMatchModal } from './CloseMatchModal';
import { DeleteMatchModal } from './DeleteMatchModal';

type Props = {
  match: PaginatedMatchDTO;
  onMatchClosed?: () => void;
};

export function MatchCard({ match, onMatchClosed }: Props) {
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const getStatusStyles = () => {
    switch (match.matchStatus) {
      case 'WIN':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          },
          badge: 'bg-green-50 border',
          badgeStyle: {
            backgroundColor: 'var(--color-success-light)',
            color: 'var(--color-status-success-text)',
            borderColor: 'var(--color-status-success-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-success-text)',
          accentColorDark: 'var(--color-status-success-accent)',
        };
      case 'LOSS':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          },
          badge: 'bg-red-50 border',
          badgeStyle: {
            backgroundColor: 'var(--color-error-light)',
            color: 'var(--color-status-error-text)',
            borderColor: 'var(--color-status-error-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-error-text)',
          accentColorDark: 'var(--color-status-error-accent)',
        };
      case 'DRAW':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          },
          badge: 'bg-yellow-50 border',
          badgeStyle: {
            backgroundColor: 'var(--color-warning-light)',
            color: 'var(--color-status-warning-text)',
            borderColor: 'var(--color-status-warning-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-warning-text)',
          accentColorDark: 'var(--color-status-warning-accent)',
        };
      case 'IN_PROGRESS':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-card-in-progress)',
            borderColor: 'var(--color-border)',
          },
          badge: 'bg-blue-50 border',
          badgeStyle: {
            backgroundColor: 'var(--color-info-light)',
            color: 'var(--color-status-info-text)',
            borderColor: 'var(--color-status-info-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-info-text)',
          accentColorDark: 'var(--color-status-info-accent)',
        };
      default:
        return {
          card: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200',
          badge: 'border',
          accent: 'border-l-4',
          accentColor: 'var(--color-muted)',
        };
    }
  };

  const getStatusText = () => {
    switch (match.matchStatus) {
      case 'WIN':
        return 'Victoire';
      case 'LOSS':
        return 'Défaite';
      case 'DRAW':
        return 'Égalité';
      case 'IN_PROGRESS':
        return 'En cours';
      default:
        return 'Inconnu';
    }
  };

  const getTypeText = () => {
    return match.matchType === 'TOURNAMENT' ? 'Tournoi' : 'Amical';
  };

  const getStatusAccentClass = () => {
    switch (match.matchStatus) {
      case 'WIN':
        return 'status-accent-win';
      case 'LOSS':
        return 'status-accent-loss';
      case 'DRAW':
        return 'status-accent-draw';
      case 'IN_PROGRESS':
        return 'status-accent-progress';
      default:
        return '';
    }
  };

  const styles = getStatusStyles();
  const accentClass = getStatusAccentClass();

  return (
    <>
      <div
        className={`rounded-xl p-6 ${styles.card} ${styles.accent} ${accentClass} bg-game-card`}
        style={{
          backgroundColor: 'var(--color-game-card)',
          borderColor: 'var(--color-border)',
          borderLeftColor: styles.accentColor,
        }}
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* Left column: Information */}
          <div className="flex-1 space-y-4">
            {/* Status tag + GameProgress */}
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${styles.badge}`}
                style={styles.badgeStyle}
              >
                {getStatusText()}
              </span>
              <GameProgressIndicator match={match} />
            </div>

            {/* Informations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">Adversaire</span>
                  <span className="text-sm font-semibold">{match.opponentName || 'Inconnu'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">Saison</span>
                  <span className="text-sm font-semibold">{match.season.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">Type</span>
                  <span className="text-sm font-semibold">{getTypeText()}</span>
                </div>
                {match.event && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">Événement</span>
                    <span className="text-sm font-semibold">{match.event.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full lg:w-auto lg:min-w-[280px]">
            {match.matchStatus === 'IN_PROGRESS' ? (
              // Actions for in-progress matches - Horizontal compact layout
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    className="flex-1 h-10 text-sm font-medium whitespace-nowrap"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/match/${match.id}`)}
                  >
                    Voir les détails
                  </Button>
                  <Button
                    className="flex-1 h-10 text-sm font-medium whitespace-nowrap"
                    onClick={() => router.push(`/dashboard/match/${match.id}/add-game`)}
                  >
                    Ajouter une partie
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 h-10 text-sm font-medium whitespace-nowrap"
                    variant="outline"
                    onClick={() => setShowCloseModal(true)}
                  >
                    Clôturer
                  </Button>
                  <Button
                    className="flex-1 h-10 text-sm font-medium whitespace-nowrap"
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ) : (
              // Actions for finished matches - Vertical simple layout
              <>
                <Button
                  className="h-11 text-sm font-medium w-full px-4"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/match/${match.id}`)}
                >
                  Voir les détails
                </Button>
                <Button
                  className="h-11 text-sm font-medium w-full px-4"
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Comment - Full width */}
        {match.comment && (
          <div className="pt-4 mt-4">
            <div
              className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: 'var(--color-comment-bg)' }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-lg" />
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-lg" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header with icon */}
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span
                    className="font-semibold text-sm"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    Note
                  </span>
                </div>

                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-3" />

                {/* Comment text */}
                <div
                  className="p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <span className="text-sm italic leading-relaxed">
                    &quot;{decodeHtmlEntities(match.comment)}&quot;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCloseModal && (
        <CloseMatchModal
          match={match}
          onClose={() => setShowCloseModal(false)}
          onMatchClosed={onMatchClosed}
        />
      )}

      {showDeleteModal && (
        <DeleteMatchModal
          match={match}
          onClose={() => setShowDeleteModal(false)}
          onMatchDeleted={onMatchClosed}
        />
      )}
    </>
  );
}
