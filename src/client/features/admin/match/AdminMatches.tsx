'use client';

import { Pagination } from '@/client/components/shared/Pagination';
import { SearchInput } from '@/client/components/shared/SearchInput';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';
import { AdminMatchDTO, getPaginatedMatchesAdminAction } from '@/server/features/match';
import { MatchTable } from './MatchTable';

type Props = {
  initialData: AdminMatchDTO[];
};

export function AdminMatches({ initialData }: Props) {
  const {
    query,
    setQuery,
    page,
    setPage,
    data: matches,
    totalPages,
    isLoading,
    error,
    refetch,
  } = usePaginatedData(getPaginatedMatchesAdminAction, initialData);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher par joueur, adversaire, saison, événement, commentaire, type (TOURNAMENT/FRIENDLY), format (BO1/BO3/BO5), statut (WIN/LOSS/DRAW/IN_PROGRESS), date (DD-MM-YYYY, ex: 15-01-2024)..."
          className="flex-1"
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <MatchTable matches={matches || []} isLoading={isLoading} onDelete={refetch} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
