import { notFound } from 'next/navigation';
import { CreateMatchWithHeroesContainer } from '@/client/features/match/CreateMatchWithHeroesContainer';
import { isSuccess } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { getCachedGameFormDataAction } from '@/server/features/statistics/getCachedGameFormDataAction';

export default async function CreateMatchWithHeroesPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const session = await getFullUserSession();
  if (!isSuccess(session)) notFound();

  const params = await searchParams;

  // Check that the data is present
  if (!params.data) {
    notFound();
  }

  try {
    // Parse the match data
    const matchData = JSON.parse(decodeURIComponent(params.data));

    if (!matchData.matchId || !matchData.matchFormat || !matchData.opponentName) {
      notFound();
    }

    // Get the faction and hero data
    const gameFormDataResult = await getCachedGameFormDataAction();

    if (!gameFormDataResult.success || !gameFormDataResult.data) {
      throw new Error(gameFormDataResult.error || 'Impossible de charger les données');
    }

    return (
      <section className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Sélection des héros</h1>
        <p className="text-muted-foreground mb-6">
          Sélectionnez vos héros pour ce match {matchData.matchFormat} contre{' '}
          {matchData.opponentName}
        </p>
        <CreateMatchWithHeroesContainer
          matchData={matchData}
          gameFormData={gameFormDataResult.data}
        />
      </section>
    );
  } catch {
    notFound();
  }
}
