import { notFound } from 'next/navigation';
import { MatchesContainer } from '@/client/features/match/MatchesContainer';
import { isSuccess } from '@/lib/result';
import { getFullUserSession } from '@/server/features/auth/getFullUserSession';
import { getPaginatedUserMatchesAction } from '@/server/features/game/getPaginatedUserMatchesAction';

export default async function MatchesPage() {
  const session = await getFullUserSession();
  if (!isSuccess(session)) notFound();

  const result = await getPaginatedUserMatchesAction({ page: 1, query: '' });
  const initialMatches = result.success ? result.data?.items || [] : [];

  return (
    <section className="max-w-6xl mx-auto py-4 px-12">
      <MatchesContainer initialMatches={initialMatches} />
    </section>
  );
}
