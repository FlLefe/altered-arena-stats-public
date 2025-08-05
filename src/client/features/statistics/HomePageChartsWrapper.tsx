'use client';

import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';
import { FactionStats, WinRateStats } from '@/server/features/statistics/StatisticsDTO';

// Lazy load the charts component itself
const HomePageChartsContent = lazy(() =>
  import('./HomePageChartsContent').then((module) => ({ default: module.HomePageChartsContent })),
);

type HomePageChartsWrapperProps = {
  seasons: BaseSeasonDTO[];
  initialFactionStats?: FactionStats[];
  initialWinRateStats?: WinRateStats[];
};

export function HomePageChartsWrapper({
  seasons,
  initialFactionStats = [],
  initialWinRateStats = [],
}: HomePageChartsWrapperProps) {
  const [shouldLoadCharts, setShouldLoadCharts] = useState(false);
  const chartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadCharts(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before charts are visible
        threshold: 0.1,
      },
    );

    if (chartsRef.current) {
      observer.observe(chartsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={chartsRef} className="min-h-[400px]">
      {shouldLoadCharts ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Chargement des graphiques...</p>
              </div>
            </div>
          }
        >
          <HomePageChartsContent
            seasons={seasons}
            initialFactionStats={initialFactionStats}
            initialWinRateStats={initialWinRateStats}
          />
        </Suspense>
      ) : (
        <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-lg">
          <div className="text-center space-y-4">
            <div className="text-4xl">📊</div>
            <p className="text-muted-foreground">Faites défiler pour voir les statistiques</p>
          </div>
        </div>
      )}
    </div>
  );
}
