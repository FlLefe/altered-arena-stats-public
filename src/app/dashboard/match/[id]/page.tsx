import { notFound } from 'next/navigation';
import { MatchDetailContainer } from '@/client/features/match';
import { getCachedMatchStatsAction } from '@/server/features/match/getCachedMatchStatsAction';

// ISR configuration
export const revalidate = 300; // 5 minutes

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;

  try {
    // Use optimized cache for match stats
    const result = await getCachedMatchStatsAction(id);

    if (!result.success || !result.data) {
      notFound();
    }

    const { match, stats } = result.data;

    return (
      <section className="max-w-6xl mx-auto p-4">
        <MatchDetailContainer match={match} initialStats={stats} />
      </section>
    );
  } catch {
    notFound();
  }
}
