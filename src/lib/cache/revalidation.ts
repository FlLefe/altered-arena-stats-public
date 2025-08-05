import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cache';

// Revalidation of static data
export function revalidateStaticData() {
  revalidateTag(CACHE_TAGS.SEASONS);
  revalidateTag(CACHE_TAGS.HEROES);
  revalidateTag(CACHE_TAGS.FACTIONS);
  revalidateTag(CACHE_TAGS.EVENTS);
}

// Specific revalidation by type
export function revalidateSeasons() {
  revalidateTag(CACHE_TAGS.SEASONS);
}

export function revalidateHeroes() {
  revalidateTag(CACHE_TAGS.HEROES);
}

export function revalidateFactions() {
  revalidateTag(CACHE_TAGS.FACTIONS);
}

export function revalidateEvents() {
  revalidateTag(CACHE_TAGS.EVENTS);
}

// Revalidation of statistics
export function revalidateStatistics() {
  revalidateTag(CACHE_TAGS.HOMEPAGE_STATS);
  revalidateTag(CACHE_TAGS.FULL_STATS);
  revalidateTag(CACHE_TAGS.MATCH_STATS);
}

export function revalidateHomePageStats() {
  revalidateTag(CACHE_TAGS.HOMEPAGE_STATS);
}

export function revalidateFullStats() {
  revalidateTag(CACHE_TAGS.FULL_STATS);
}

export function revalidateMatchStats() {
  revalidateTag(CACHE_TAGS.MATCH_STATS);
}

// Revalidation of user data
export function revalidateUserData() {
  revalidateTag(CACHE_TAGS.USER_DATA);
}
