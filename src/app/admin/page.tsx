import AdminTabs from '@/client/features/admin/AdminTabs';
import {
  getPaginatedEventsAction,
  getPaginatedSeasonsAction,
  getPaginatedHeroesAction,
  getPaginatedFactionsAction,
} from '@/server/features';
import { getPaginatedGamesAdminAction } from '@/server/features/game';
import { getPaginatedMatchesAdminAction } from '@/server/features/match';
import { getPaginatedPlayersAction } from '@/server/features/player';

// Page admin - dynamic data (no cache)
export const dynamic = 'force-dynamic';

export default async function AdminPanelPage() {
  const [players, seasons, factions, heroes, events, matches, games] = await Promise.all([
    getPaginatedPlayersAction({ page: 1, query: '' }),
    getPaginatedSeasonsAction({ page: 1, query: '' }),
    getPaginatedFactionsAction({ page: 1, query: '' }),
    getPaginatedHeroesAction({ page: 1, query: '' }),
    getPaginatedEventsAction({ page: 1, query: '' }),
    getPaginatedMatchesAdminAction({ page: 1, query: '' }),
    getPaginatedGamesAdminAction({ page: 1, query: '' }),
  ]);

  // Extract data safely
  const initialUsers = players.success ? players.data?.items || [] : [];
  const initialSeasons = seasons.success ? seasons.data?.items || [] : [];
  const initialFactions = factions.success ? factions.data?.items || [] : [];
  const initialHeroes = heroes.success ? heroes.data?.items || [] : [];
  const initialEvents = events.success ? events.data?.items || [] : [];
  const initialMatches = matches.success ? matches.data?.items || [] : [];
  const initialGames = games.success ? games.data?.items || [] : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Panneau d&apos;administration</h1>
      <AdminTabs
        initialUsers={initialUsers}
        initialSeasons={initialSeasons}
        initialFactions={initialFactions}
        initialHeroes={initialHeroes}
        initialEvents={initialEvents}
        initialMatches={initialMatches}
        initialGames={initialGames}
      />
    </div>
  );
}
