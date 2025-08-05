// Client-side types for matchup statistics
export interface HeroMatchupStats {
  heroId: string;
  heroName: string;
  factionColor: string;
  factionName: string;
  totalGames: number;
  winRate: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  bestMatchups: HeroMatchup[];
  worstMatchups: HeroMatchup[];
}

export interface HeroMatchup {
  opponentHeroId: string;
  opponentHeroName: string;
  opponentFactionColor: string;
  opponentFactionName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}
