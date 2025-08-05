'use client';

import { memo, useMemo } from 'react';
import { Calendar, User, Trophy, Target, BookOpen } from 'lucide-react';
import { MatchWithGames } from '@/types';
import { formatDate } from '@/utils/date';
import { formatMatchFormat } from '@/utils/match';

type Props = {
  match: MatchWithGames;
};

export const MatchInfo = memo(function MatchInfo({ match }: Props) {
  const typeText = useMemo(() => {
    if (match.matchType === 'TOURNAMENT') {
      if (match.event && match.event.name && match.event.name.trim() !== '') {
        return match.event.name;
      }

      if (match.eventId && !match.event) {
        return 'Tournoi (événement non trouvé)';
      }

      return 'Tournoi (non spécifié)';
    }
    return 'Amical';
  }, [match.matchType, match.event, match.eventId]);

  const formatText = useMemo(() => {
    return formatMatchFormat(match.matchFormat);
  }, [match.matchFormat]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm text-muted-foreground font-medium">Adversaire</span>
          <p className="font-semibold truncate">{match.opponentName || 'Inconnu'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm text-muted-foreground font-medium">Créé le</span>
          <p className="font-semibold truncate">{formatDate(match.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Trophy className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm text-muted-foreground font-medium">Type</span>
          <p className="font-semibold truncate">{typeText}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Target className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm text-muted-foreground font-medium">Format</span>
          <p className="font-semibold truncate">{formatText}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm text-muted-foreground font-medium">Saison</span>
          <p className="font-semibold truncate">{match.season.name}</p>
        </div>
      </div>
    </div>
  );
});
