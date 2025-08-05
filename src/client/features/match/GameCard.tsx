'use client';

import { useState, useMemo, memo } from 'react';
import { MessageSquare, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntities } from '@/lib/sanitization';
import { Game } from '@/types';
import { formatDate } from '@/utils/date';
import { DeleteGameModal } from './DeleteGameModal';

type Props = {
  game: Game;
  gameNumber: number;
  matchStatus: 'WIN' | 'LOSS' | 'DRAW' | 'IN_PROGRESS';
  onGameDeleted?: () => void;
};

export const GameCard = memo(function GameCard({
  game,
  gameNumber,
  matchStatus,
  onGameDeleted,
}: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Memoize styles to avoid recalculations
  const styles = useMemo(() => {
    switch (game.gameStatus) {
      case 'WIN':
        return {
          badge: 'bg-green-50 border',
          badgeStyle: {
            backgroundColor: 'var(--color-success-light)',
            color: 'var(--color-status-success-text)',
            borderColor: 'var(--color-status-success-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-success-accent)',
        };
      case 'LOSS':
        return {
          badge: 'bg-red-50 border',
          badgeStyle: {
            backgroundColor: 'var(--color-error-light)',
            color: 'var(--color-status-error-text)',
            borderColor: 'var(--color-status-error-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-error-accent)',
        };
      case 'DRAW':
        return {
          badge: 'bg-yellow-50 border',
          badgeStyle: {
            backgroundColor: 'var(--color-warning-light)',
            color: 'var(--color-status-warning-text)',
            borderColor: 'var(--color-status-warning-border)',
          },
          accent: 'border-l-4',
          accentColor: 'var(--color-status-warning-accent)',
        };
      default:
        return {
          badge: 'border',
          accent: 'border-l-4',
          accentColor: 'var(--color-muted)',
        };
    }
  }, [game.gameStatus]);

  // Memoize status text
  const statusText = useMemo(() => {
    switch (game.gameStatus) {
      case 'WIN':
        return 'Victoire';
      case 'LOSS':
        return 'Défaite';
      case 'DRAW':
        return 'Égalité';
      default:
        return 'Inconnu';
    }
  }, [game.gameStatus]);

  return (
    <div
      className={`border rounded-xl p-6 md:px-12 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-xl mx-auto lg:max-w-xl ${styles.accent}`}
      style={{
        backgroundColor: 'var(--color-game-card)',
        borderColor: 'var(--color-border)',
        borderLeftColor: styles.accentColor,
      }}
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header with number and status */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            {gameNumber}
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${styles.badge}`}
            style={styles.badgeStyle}
          >
            {statusText}
          </span>
        </div>

        {/* VS zone with heroes */}
        <div className="relative">
          {/* Heroes labels */}
          <div className="flex mb-4">
            <div className="flex-1 text-sm text-muted-foreground font-medium text-center">
              Votre héros
            </div>
            <div className="flex-1 text-sm text-muted-foreground font-medium text-center">
              Héros adverse
            </div>
          </div>

          {/* Unique zone with diagonal blur effect */}
          <div
            className="relative h-[120px] rounded-lg overflow-hidden"
            style={{
              boxShadow: `0 0 20px var(--color-gamecard-shadow),
                          inset 0 0 0 1px var(--color-gamecard-shadow-inset)`,
            }}
          >
            {/* Faction color overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, 
                          ${game.playerHero.faction.colorCode}25 0%, 
                          ${game.playerHero.faction.colorCode}25 45%, 
                          ${game.playerHero.faction.colorCode}15 50%, 
                          ${game.opponentHero.faction.colorCode}15 50%, 
                          ${game.opponentHero.faction.colorCode}25 55%, 
                          ${game.opponentHero.faction.colorCode}25 100%)`,
              }}
            />

            {/* Heroes backgrounds container */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Player hero background - left 60% with diagonal clip and no blur */}
              {game.playerHero.imageUrl && (
                <div
                  className="absolute top-0 left-0 w-[60%] h-full opacity-50 bg-cover bg-left"
                  style={{
                    backgroundImage: `url(${game.playerHero.imageUrl})`,
                    backgroundPosition: 'left 0%',
                    clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)',
                    WebkitClipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)',
                  }}
                />
              )}

              {/* Opponent hero background - right 60% with complementary clip and no blur */}
              {game.opponentHero.imageUrl && (
                <div
                  className="absolute top-0 right-0 w-[60%] h-full opacity-50 bg-cover"
                  style={{
                    backgroundImage: `url(${game.opponentHero.imageUrl})`,
                    backgroundPosition: 'center',
                    clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
                    WebkitClipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                />
              )}
            </div>

            {/* Overlay for better text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, 
                          rgba(0, 0, 0, 0.4) 0%, 
                          rgba(0, 0, 0, 0.2) 45%, 
                          rgba(0, 0, 0, 0.2) 55%, 
                          rgba(0, 0, 0, 0.4) 100%)`,
              }}
            />

            {/* Diagonal line removed - images create natural separation */}

            {/* Heroes content */}
            <div className="relative flex items-center h-full">
              {/* Your hero */}
              <div className="flex-1 p-3 sm:p-4 flex items-center justify-center pr-8 sm:pr-12">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <div className="text-center">
                    <div
                      className="font-bold text-base sm:text-lg leading-tight"
                      style={{
                        color: game.playerHero.faction.colorCode,
                        textShadow:
                          '0 0 8px rgba(255, 255, 255, 0.9), 0 0 4px rgba(255, 255, 255, 0.8), 0 0 2px rgba(255, 255, 255, 1)',
                      }}
                    >
                      {game.playerHero.name}
                    </div>
                    <div
                      className="text-xs sm:text-sm mt-1 font-bold"
                      style={{
                        color: game.playerHero.faction.colorCode,
                        opacity: 0.9,
                        textShadow:
                          '0 0 6px rgba(255, 255, 255, 0.9), 0 0 3px rgba(255, 255, 255, 0.8), 0 0 1px rgba(255, 255, 255, 1)',
                      }}
                    >
                      {game.playerHero.faction.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Opponent hero */}
              <div className="flex-1 p-3 sm:p-4 flex items-center justify-center pl-8 sm:pl-12">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <div className="text-center">
                    <div
                      className="font-bold text-base sm:text-lg leading-tight"
                      style={{
                        color: game.opponentHero.faction.colorCode,
                        textShadow:
                          '0 0 8px rgba(255, 255, 255, 0.9), 0 0 4px rgba(255, 255, 255, 0.8), 0 0 2px rgba(255, 255, 255, 1)',
                      }}
                    >
                      {game.opponentHero.name}
                    </div>
                    <div
                      className="text-xs sm:text-sm mt-1 font-bold"
                      style={{
                        color: game.opponentHero.faction.colorCode,
                        opacity: 0.9,
                        textShadow:
                          '0 0 6px rgba(255, 255, 255, 0.9), 0 0 3px rgba(255, 255, 255, 0.8), 0 0 1px rgba(255, 255, 255, 1)',
                      }}
                    >
                      {game.opponentHero.faction.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VS badge */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 shadow-xl"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  className="text-base sm:text-lg font-bold"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  VS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment and date with icons */}
        <div className="flex flex-col gap-3">
          {game.comment && (
            <div className="relative overflow-hidden border bg-comment-bg border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-lg" />
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-md" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground text-sm">Commentaire</span>
                </div>
                <div className="relative pt-3">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  <div className="relative p-3 rounded-lg bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                    <p className="italic leading-relaxed text-foreground break-words text-xs sm:text-sm">
                      &quot;{decodeHtmlEntities(game.comment)}&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(game.createdAt)}</span>
            </div>
            {matchStatus === 'IN_PROGRESS' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto p-1"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteGameModal
          game={game}
          gameNumber={gameNumber}
          onClose={() => setShowDeleteModal(false)}
          onGameDeleted={onGameDeleted}
        />
      )}
    </div>
  );
});
