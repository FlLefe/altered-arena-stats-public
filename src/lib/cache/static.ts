import { cache } from 'react';
import { getAllEventsAction } from '@/server/features/event';
import { getAllFactionsAction } from '@/server/features/faction';
import { getAllHeroesAction } from '@/server/features/hero';
import { getAllSeasonsAction } from '@/server/features/season';

export const getCachedSeasons = cache(async () => {
  return await getAllSeasonsAction();
});

export const getCachedHeroes = cache(async () => {
  return await getAllHeroesAction();
});

export const getCachedFactions = cache(async () => {
  return await getAllFactionsAction();
});

export const getCachedEvents = cache(async () => {
  const result = await getAllEventsAction();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error || 'Erreur lors du chargement des événements');
});

// Combined cache for main static data
export const getCachedStaticData = cache(async () => {
  const [seasons, heroes, factions, events] = await Promise.all([
    getCachedSeasons(),
    getCachedHeroes(),
    getCachedFactions(),
    getCachedEvents(),
  ]);

  return {
    seasons,
    heroes,
    factions,
    events,
  };
});

// Specialized cache for onboarding (factions + heroes only)
export const getCachedOnboardingData = cache(async () => {
  const [factions, heroes] = await Promise.all([getCachedFactions(), getCachedHeroes()]);

  return {
    factions,
    heroes,
  };
});

// Cache for game forms (factions + heroes)
export const getCachedGameFormData = cache(async () => {
  const [factions, heroes] = await Promise.all([getCachedFactions(), getCachedHeroes()]);

  return {
    factions,
    heroes,
  };
});

// Cache for hero selectors (heroes grouped by faction)
export const getCachedHeroSelectData = cache(async () => {
  const [factions, heroes] = await Promise.all([getCachedFactions(), getCachedHeroes()]);

  // Group heroes by faction to optimize selectors
  const heroesByFaction = heroes.reduce(
    (acc, hero) => {
      const factionId = hero.faction.id;
      if (!acc[factionId]) {
        acc[factionId] = [];
      }
      acc[factionId].push(hero);
      return acc;
    },
    {} as Record<string, typeof heroes>,
  );

  return {
    factions,
    heroes,
    heroesByFaction,
  };
});
