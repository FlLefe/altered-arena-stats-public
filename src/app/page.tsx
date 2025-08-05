import { Target } from 'lucide-react';
import { ResourceCard } from '@/client/components/ResourceCard';
import { HomePageChartsWrapper } from '@/client/features/statistics/HomePageChartsWrapper';
import { HomePagePerformanceCards } from '@/client/features/statistics/HomePagePerformanceCards';
import { usefulResources, communitySites } from '@/data/resources';
import { getAllSeasonsAction } from '@/server/features/season';
import { getCachedHomePageStatsAction } from '@/server/features/statistics/getCachedHomePageStatsAction';
import { getCurrentSeason } from '@/utils/season';

// ISR configuration - revalidation every 10 minutes
export const revalidate = 600; // 10 minutes

export default async function HomePage() {
  // Server-side data retrieval with cache
  const [seasons, statsResult] = await Promise.all([
    getAllSeasonsAction(),
    getCachedHomePageStatsAction(),
  ]);

  const currentSeason = getCurrentSeason(seasons);

  // Statistics data (with fallback if error)
  const factionStats =
    statsResult.success && statsResult.data?.factionStats ? statsResult.data.factionStats : [];
  const winRateStats =
    statsResult.success && statsResult.data?.winRateStats ? statsResult.data.winRateStats : [];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 space-y-16">
      {/* Hero Section with impactful typography */}
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black text-text leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
              Altered Arena Stats
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            La plateforme communautaire pour suivre vos performances sur le TCG Altered. Enregistrez
            vos parties, suivez les métas et découvrez les factions les plus jouées !
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/login"
            className="btn-gradient-blue text-lg px-8 py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Commencer maintenant
          </a>
        </div>
      </div>

      {/* Current season statistics */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            Statistiques de la{' '}
            <span className="text-primary">{currentSeason?.name || 'saison en cours'}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les performances actuelles, les héros les plus populaires et les métas
            émergentes
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            <Target className="inline h-4 w-4 mr-1" />
            Contribuez à enrichir ces statistiques en ajoutant vos parties !
          </p>
        </div>

        <HomePagePerformanceCards seasons={seasons} />

        <HomePageChartsWrapper
          seasons={seasons}
          initialFactionStats={factionStats}
          initialWinRateStats={winRateStats}
        />
      </div>

      {/* Useful resources section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            Ressources <span className="text-primary">utiles</span>
          </h2>
          <p className="text-muted-foreground">
            Tout ce dont vous avez besoin pour maîtriser Altered
          </p>
        </div>

        <ResourceCard items={usefulResources} />
      </div>

      {/* Community sites section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            Sites de la <span className="text-primary">communauté</span>
          </h2>
          <p className="text-muted-foreground">
            Découvrez les meilleurs sites créés par la communauté Altered
          </p>
        </div>

        <ResourceCard items={communitySites} />
      </div>
    </div>
  );
}
