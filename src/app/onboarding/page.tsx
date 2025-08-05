import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/client/features/onboarding/OnboardingForm';
import { checkOnboardingStatusAction } from '@/server/features/player/checkOnboardingStatusAction';
import { getCachedOnboardingDataAction } from '@/server/features/statistics';

// ISR configuration
export const revalidate = 1800; // 30 minutes

export default async function OnboardingPage() {
  // Check if the user needs onboarding
  const onboardingStatus = await checkOnboardingStatusAction();

  if (onboardingStatus.success && onboardingStatus.data?.profileComplete) {
    // The user has already completed their profile, redirect to the home page
    redirect('/');
  }

  try {
    const result = await getCachedOnboardingDataAction();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Erreur lors du chargement des données');
    }

    const { factions, heroes } = result.data;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <OnboardingForm factions={factions} heroes={heroes} />
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="text-destructive text-center mt-8">
        Erreur lors du chargement des données :{' '}
        {err instanceof Error ? err.message : 'Erreur inconnue'}
      </div>
    );
  }
}
