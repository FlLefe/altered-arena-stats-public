'use client';

import { useState, useMemo, memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MatchWithGames } from '@/types';
import { CloseMatchModal } from './CloseMatchModal';
import { DeleteMatchModal } from './DeleteMatchModal';
import {
  MatchHeader,
  MatchInfo,
  MatchActions,
  MatchStats,
  MatchComment,
  MatchStatusBadge,
  MatchGamesList,
} from './matchDetails';

type Props = {
  match: MatchWithGames;
  initialStats: {
    wins: number;
    losses: number;
    draws: number;
    totalGames: number;
  };
};

export const MatchDetailContainer = memo(function MatchDetailContainer({
  match,
  initialStats,
}: Props) {
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize styles to avoid recalculations
  const styles = useMemo(() => {
    switch (match.matchStatus) {
      case 'WIN':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-game-card)',
            borderColor: 'var(--color-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-success-text)',
        };
      case 'LOSS':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-game-card)',
            borderColor: 'var(--color-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-error-text)',
        };
      case 'DRAW':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-game-card)',
            borderColor: 'var(--color-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-warning-text)',
        };
      case 'IN_PROGRESS':
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-card-in-progress)',
            borderColor: 'var(--color-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-info-text)',
        };
      default:
        return {
          card: 'border shadow-sm hover:shadow-md transition-shadow duration-200',
          cardStyle: {
            backgroundColor: 'var(--color-game-card)',
            borderColor: 'var(--color-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-muted)',
        };
    }
  }, [match.matchStatus]);

  const accentClass = useMemo(() => {
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
  }, [match.matchStatus]);

  // Conditional rendering to avoid hydration
  if (!isClient) {
    return (
      <div className="space-y-8">
        <MatchHeader />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MatchHeader />

      {/* Main match information */}
      <div
        className={`rounded-xl p-6 ${styles.card} ${styles.accent} ${accentClass}`}
        style={{
          ...styles.cardStyle,
          borderLeftColor: styles.accentColor,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Match information */}
          <div className="space-y-6 min-w-0">
            <MatchStatusBadge matchStatus={match.matchStatus} />
            <MatchInfo match={match} />
            <MatchActions
              match={match}
              onCloseMatch={() => setShowCloseModal(true)}
              onDeleteMatch={() => setShowDeleteModal(true)}
            />
          </div>

          {/* Right column - Statistics */}
          <div className="space-y-6">
            <MatchStats stats={initialStats} />
          </div>
        </div>

        {/* Comment - Full width */}
        {match.comment && <MatchComment comment={match.comment} />}
      </div>

      {/* List of games */}
      <MatchGamesList
        match={match}
        totalGames={initialStats.totalGames}
        onGameDeleted={() => router.refresh()}
      />

      {/* Modals */}
      {showCloseModal && (
        <CloseMatchModal
          match={match}
          onClose={() => setShowCloseModal(false)}
          onMatchClosed={() => router.refresh()}
        />
      )}

      {showDeleteModal && (
        <DeleteMatchModal
          match={match}
          onClose={() => setShowDeleteModal(false)}
          onMatchDeleted={() => router.push('/dashboard/matches')}
        />
      )}
    </div>
  );
});
