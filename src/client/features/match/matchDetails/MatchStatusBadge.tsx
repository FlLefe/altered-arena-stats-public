'use client';

import { memo, useMemo } from 'react';

type Props = {
  matchStatus: 'WIN' | 'LOSS' | 'DRAW' | 'IN_PROGRESS';
};

export const MatchStatusBadge = memo(function MatchStatusBadge({ matchStatus }: Props) {
  const statusText = useMemo(() => {
    switch (matchStatus) {
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
  }, [matchStatus]);

  const badgeStyle = useMemo(() => {
    switch (matchStatus) {
      case 'WIN':
        return {
          backgroundColor: 'var(--color-success-light)',
          color: 'var(--color-status-success-text)',
          borderColor: 'var(--color-status-success-border)',
        };
      case 'LOSS':
        return {
          backgroundColor: 'var(--color-error-light)',
          color: 'var(--color-status-error-text)',
          borderColor: 'var(--color-status-error-border)',
        };
      case 'DRAW':
        return {
          backgroundColor: 'var(--color-warning-light)',
          color: 'var(--color-status-warning-text)',
          borderColor: 'var(--color-status-warning-border)',
        };
      case 'IN_PROGRESS':
        return {
          backgroundColor: 'var(--color-info-light)',
          color: 'var(--color-status-info-text)',
          borderColor: 'var(--color-status-info-border)',
        };
      default:
        return {};
    }
  }, [matchStatus]);

  return (
    <div className="flex justify-center">
      <span
        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 border"
        style={badgeStyle}
      >
        {statusText}
      </span>
    </div>
  );
});
