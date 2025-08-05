// Cache tags for manual revalidation
export const CACHE_TAGS = {
  SEASONS: 'seasons',
  HEROES: 'heroes',
  FACTIONS: 'factions',
  EVENTS: 'events',
  HOMEPAGE_STATS: 'homepage-stats',
  FULL_STATS: 'full-stats',
  MATCH_STATS: 'match-stats',
  USER_DATA: 'user-data',
} as const;

// Client-side cache configuration for statistics
export const STATISTICS_CACHE = {
  STORAGE_KEY: 'altered-stats-cache',
  DEFAULT_TTL: 15 * 60 * 1000, // 15 minutes in milliseconds
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour in milliseconds
} as const;
