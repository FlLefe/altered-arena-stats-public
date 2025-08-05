import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';

/**
 * Find the current season based on the current date
 * @param seasons - List of available seasons
 * @returns The current season or the first season if none is current
 */
export function getCurrentSeason(seasons: BaseSeasonDTO[]): BaseSeasonDTO | undefined {
  if (!seasons.length) return undefined;

  const now = new Date();
  return (
    seasons.find((season) => {
      const startDate = new Date(season.startDate);
      const endDate = new Date(season.endDate);
      return now >= startDate && now <= endDate;
    }) || seasons[0]
  ); // Fallback to the first season if no current season
}
