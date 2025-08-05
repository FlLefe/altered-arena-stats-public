'use client';

import { Pagination } from '@/client/components/shared/Pagination';
import { SearchInput } from '@/client/components/shared/SearchInput';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';
import { getPaginatedSeasonsAction, PaginatedSeasonDTO } from '@/server/features/season';
import { CreateSeasonModal } from './CreateSeasonModal';
import { SeasonTable } from './SeasonTable';

type Props = {
  initialData: PaginatedSeasonDTO[];
};

export function AdminSeasons({ initialData }: Props) {
  const {
    query,
    setQuery,
    page,
    setPage,
    data: seasons,
    totalPages,
    isLoading,
    error,
    refetch,
  } = usePaginatedData(getPaginatedSeasonsAction, initialData);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher une saison"
          className="flex-1"
        />
        <CreateSeasonModal onCreated={refetch} />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <SeasonTable seasons={seasons || []} isLoading={isLoading} onDelete={refetch} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
