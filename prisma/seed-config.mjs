// Faction configuration
export const FACTION_DATA = [
  { name: 'Axiom', colorCode: '#884F34' },
  { name: 'Bravos', colorCode: '#AB2433' },
  { name: 'Lyra', colorCode: '#CA4B6C' },
  { name: 'Muna', colorCode: '#2D6A42' },
  { name: 'Ordis', colorCode: '#026190' },
  { name: 'Yzmir', colorCode: '#6F4F94' },
];

// Season configuration
export const SEASON_DATA = [
  {
    name: 'Saison 1 : Au-delà des portes',
    startDate: '2024-09-13',
    endDate: '2025-01-31',
  },
  {
    name: 'Saison 2 : Épreuves du froid',
    startDate: '2025-02-01',
    endDate: '2025-06-06',
  },
  {
    name: 'Saison 3 : Murmures du labyrinthe',
    startDate: '2025-06-06',
    endDate: '2025-09-30',
  },
];

// Default events configuration
export const DEFAULT_EVENTS = [
  { name: 'Tournoi en ligne', eventType: 'DEFAULT' },
  { name: 'Championnat régional', eventType: 'DEFAULT' },
  { name: 'Tournoi de qualification', eventType: 'DEFAULT' },
  { name: 'Tournoi en boutique', eventType: 'DEFAULT' },
];

// Default player configuration
export const DEFAULT_PLAYER_CONFIG = {
  alteredAlias: 'default',
  role: 'user',
};
