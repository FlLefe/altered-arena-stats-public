import { MatchFormat, MatchType } from '@/server/features/match';

export type MatchDraftFormData = {
  matchType: MatchType;
  matchFormat: MatchFormat;
  seasonId: string;
  eventId: string;
  opponentName: string;
  comment: string;
};

export type MatchDraftFormDataPartial = Partial<MatchDraftFormData>;

export type GameFormData = {
  playerHeroId: string;
  opponentHeroId: string;
  gameStatus: 'WIN' | 'LOSS' | 'DRAW';
  comment: string;
};

export type GameFormDataPartial = Partial<GameFormData>;

export type MatchWithGames = {
  id: string;
  matchType: MatchType;
  matchFormat: MatchFormat;
  matchStatus: 'WIN' | 'LOSS' | 'DRAW' | 'IN_PROGRESS';
  comment: string | null;
  opponentName: string | null;
  opponentId: string | null;
  playerId: string | null;
  seasonId: string;
  eventId: string | null;
  createdAt: Date;
  updatedAt: Date;
  season: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };
  event: {
    id: string;
    name: string;
    eventType: 'DEFAULT' | 'CUSTOM';
  } | null;
  games: Game[];
};

export type Game = {
  id: string;
  matchId: string;
  playerHeroId: string;
  opponentHeroId: string;
  gameStatus: 'WIN' | 'LOSS' | 'DRAW';
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  playerHero: {
    id: string;
    name: string;
    imageUrl: string | null;
    faction: {
      id: string;
      name: string;
      colorCode: string;
    };
  };
  opponentHero: {
    id: string;
    name: string;
    imageUrl: string | null;
    faction: {
      id: string;
      name: string;
      colorCode: string;
    };
  };
};
