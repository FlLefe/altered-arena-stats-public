'use client';

import { PaginatedMatchDTO } from '@/server/features/match';
import { getMaxGamesForFormat } from '@/utils/match';

// SVG icons for game statuses
const WinIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const LossIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const DrawIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 6h14v2H3z M3 12h14v2H3z" />
  </svg>
);

type Props = {
  match: PaginatedMatchDTO;
};

export function GameProgressIndicator({ match }: Props) {
  const maxGames = getMaxGamesForFormat(match.matchFormat);
  const playedGames = match.games.length;
  const progressPercentage = (playedGames / maxGames) * 100;
  const shouldWrap = maxGames > 5;

  return (
    <div className="flex items-center gap-4">
      {/* Progress bar */}
      <div className="flex-1 max-w-40">
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-center font-medium">
          {playedGames}/{maxGames}
        </div>
      </div>

      {/* Game indicators */}
      <div className={`flex gap-2 ${shouldWrap ? 'flex-wrap max-w-full' : ''}`}>
        {Array.from({ length: maxGames }, (_, index) => {
          const game = match.games[index];
          const isPlayed = game !== undefined;

          return (
            <div
              key={index}
              className={`relative w-5 h-5 rounded-md border transition-all duration-300 ease-out hover:scale-110 ${
                isPlayed
                  ? `border-transparent shadow-sm ${
                      game.gameStatus === 'WIN'
                        ? 'bg-green-500 text-white'
                        : game.gameStatus === 'LOSS'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-white'
                    }`
                  : 'bg-gray-200 border-gray-300'
              }`}
              title={
                isPlayed ? `Game ${index + 1}: ${game.gameStatus}` : `Game ${index + 1} (non jouée)`
              }
            >
              {isPlayed && (
                <div className="flex items-center justify-center h-full">
                  {game.gameStatus === 'WIN' && <WinIcon />}
                  {game.gameStatus === 'LOSS' && <LossIcon />}
                  {game.gameStatus === 'DRAW' && <DrawIcon />}
                </div>
              )}

              {/* Subtle glow effect for played games */}
              {isPlayed && (
                <div
                  className={`absolute inset-0 rounded-md opacity-20 blur-sm ${
                    game.gameStatus === 'WIN'
                      ? 'bg-green-500'
                      : game.gameStatus === 'LOSS'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
