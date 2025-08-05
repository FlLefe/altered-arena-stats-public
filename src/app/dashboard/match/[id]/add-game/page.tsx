import { notFound } from 'next/navigation';
import { AddGameContainer } from '@/client/features/game/AddGameContainer';
import { getMatchByIdAction } from '@/server/features/match/getMatchByIdAction';
import { getCachedGameFormDataAction } from '@/server/features/statistics';

// ISR for the add-game page
export const revalidate = 1800; // 30 minutes

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ heroes?: string }>;
};

export default async function AddGamePage({ params, searchParams }: Props) {
  const { id } = await params;
  const searchParamsData = await searchParams;

  // Retrieve data in parallel
  const [matchResult, gameFormDataResult] = await Promise.all([
    getMatchByIdAction({ matchId: id }),
    getCachedGameFormDataAction(),
  ]);

  if (!matchResult.success || !matchResult.data) {
    notFound();
  }

  const match = matchResult.data;
  if (match.matchStatus !== 'IN_PROGRESS') {
    throw new Error('Ce match est déjà terminé');
  }

  // Extract form data
  const gameFormData =
    gameFormDataResult.success && gameFormDataResult.data ? gameFormDataResult.data : null;

  // Parse the pre-selected heroes if present
  let preselectedHeroes = null;
  if (searchParamsData.heroes) {
    try {
      preselectedHeroes = JSON.parse(decodeURIComponent(searchParamsData.heroes));
    } catch {
      // Ignore parsing errors, we will use the default values
    }
  }

  return (
    <section className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Ajouter une partie</h1>
      <AddGameContainer
        match={match}
        gameFormData={gameFormData}
        preselectedHeroes={preselectedHeroes}
      />
    </section>
  );
}
