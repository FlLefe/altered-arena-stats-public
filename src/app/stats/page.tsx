import { Suspense } from 'react';
import type { Metadata } from 'next';
import { StatisticsContainer } from '@/client/features/statistics/StatisticsContainer';
import { getAllSeasonsAction, getCachedStatsPageAction } from '@/server/features';

// ISR configuration - revalidation every 15 minutes
export const revalidate = 900; // 15 minutes

export const metadata: Metadata = {
  title: 'Statistiques',
  description:
    "Analysez les performances, découvrez les métas et suivez l'évolution du jeu Altered à travers les statistiques de la communauté. Graphiques détaillés et analyses en temps réel.",
  keywords: [
    'statistiques Altered',
    'métas TCG',
    'performance factions',
    'héros populaires',
    'taux de victoire',
    'analyses tournois',
    'graphiques Altered',
    'données communautaires',
  ],
  openGraph: {
    title: 'Statistiques Altered Arena - Analyses et Métas',
    description:
      "Analysez les performances, découvrez les métas et suivez l'évolution du jeu Altered",
    url: 'https://altered-arena-stats.fr/stats',
    images: [
      {
        url: '/images/Logo.webp',
        width: 1200,
        height: 630,
        alt: 'Statistiques Altered Arena',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Statistiques Altered Arena - Analyses et Métas',
    description: 'Analysez les performances et découvrez les métas du TCG Altered',
    images: ['/images/Logo.webp'],
  },
  alternates: {
    canonical: 'https://altered-arena-stats.fr/stats',
  },
};

export default async function StatisticsPage() {
  // Server-side data retrieval with cache
  const [seasons, statsResult] = await Promise.all([
    getAllSeasonsAction(),
    getCachedStatsPageAction(),
  ]);

  // Statistics data (with fallback if error)
  const factionStats =
    statsResult.success && statsResult.data?.factionStats ? statsResult.data.factionStats : [];
  const winRateStats =
    statsResult.success && statsResult.data?.winRateStats ? statsResult.data.winRateStats : [];
  const matchTypeStats =
    statsResult.success && statsResult.data?.matchTypeStats
      ? statsResult.data.matchTypeStats
      : null;
  const heroMatchups =
    statsResult.success && statsResult.data?.heroMatchups ? statsResult.data.heroMatchups : [];

  const appliedFilters =
    statsResult.success && statsResult.data?.appliedFilters ? statsResult.data.appliedFilters : {};

  return (
    <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-text">Statistiques Altered Arena</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analysez les performances, découvrez les métas et suivez l&apos;évolution du jeu à travers
          les statistiques de la communauté.
        </p>
      </div>

      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <StatisticsContainer
          initialSeasons={seasons}
          initialFactionStats={factionStats}
          initialWinRateStats={winRateStats}
          initialMatchTypeStats={matchTypeStats}
          initialHeroMatchups={heroMatchups}
          initialFilters={appliedFilters}
        />
      </Suspense>
    </div>
  );
}
