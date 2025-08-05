'use client';

import { Pagination } from '@/client/components/shared/Pagination';
import { SearchInput } from '@/client/components/shared/SearchInput';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';
import { PaginatedGameDTO } from '@/server/features';
import { getPaginatedGamesAdminAction } from '@/server/features/game';
import { GameTable } from './GameTable';

type Props = {
  initialData: PaginatedGameDTO[];
};

export function AdminGames({ initialData }: Props) {
  const {
    query,
    setQuery,
    page,
    setPage,
    data: games,
    totalPages,
    isLoading,
    error,
    refetch,
  } = usePaginatedData(getPaginatedGamesAdminAction, initialData);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher par joueur, héros, commentaire, statut (WIN/LOSS/DRAW), date (DD-MM-YYYY, ex: 15-01-2024)..."
          className="flex-1"
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <GameTable games={games || []} isLoading={isLoading} onDelete={refetch} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
