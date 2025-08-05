'use client';

import { memo } from 'react';

type Props = {
  stats: {
    wins: number;
    losses: number;
    draws: number;
    totalGames: number;
  };
};

export const MatchStats = memo(function MatchStats({ stats }: Props) {
  return (
    <div
      className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ backgroundColor: 'var(--color-stats-bg)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/30 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <h3
          className="font-bold mb-6 text-xl text-center"
          style={{ color: 'var(--color-foreground)' }}
        >
          Statistiques des parties
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-4xl font-black text-green-600 dark:text-green-400 drop-shadow-sm">
                {stats.wins}
              </div>
              <div
                className="text-sm mt-2 font-semibold"
                style={{ color: 'var(--color-status-success-text)' }}
              >
                Victoires
              </div>
            </div>
          </div>
          <div className="group relative p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-4xl font-black text-red-600 dark:text-red-400 drop-shadow-sm">
                {stats.losses}
              </div>
              <div
                className="text-sm mt-2 font-semibold"
                style={{ color: 'var(--color-status-error-text)' }}
              >
                Défaites
              </div>
            </div>
          </div>
          <div className="group relative p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-4xl font-black text-yellow-600 dark:text-yellow-400 drop-shadow-sm">
                {stats.draws}
              </div>
              <div
                className="text-sm mt-2 font-semibold"
                style={{ color: 'var(--color-status-warning-text)' }}
              >
                Égalités
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Total : {stats.totalGames} partie{stats.totalGames > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
