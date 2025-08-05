import { notFound } from 'next/navigation';
import { AddMatchContainer } from '@/client/features/match/AddMatchContainer';
import { isSuccess } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { getCachedStaticDataAction } from '@/server/features/statistics';

// ISR configuration
export const revalidate = 1800; // 30 minutes

export default async function AddMatchPage() {
  const session = await getFullUserSession();
  if (!isSuccess(session)) notFound();

  try {
    // Use static cache to retrieve seasons and other data
    const result = await getCachedStaticDataAction();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Impossible de charger les données');
    }

    const { seasons } = result.data;

    return (
      <section className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Créer un match</h1>
        <AddMatchContainer seasons={seasons} />
      </section>
    );
  } catch {
    throw new Error('Impossible de charger les données nécessaires');
  }
}
