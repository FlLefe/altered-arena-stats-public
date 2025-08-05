'use client';

import { Pagination } from '@/client/components/shared/Pagination';
import { SearchInput } from '@/client/components/shared/SearchInput';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';
import { getPaginatedFactionsAction } from '@/server/features';
import { PaginatedFactionDTO } from '@/server/features/faction/FactionDTO';
import { CreateFactionModal } from './CreateFactionModal';
import { FactionTable } from './FactionTable';

type Props = {
  initialData: PaginatedFactionDTO[];
};

export function AdminFactions({ initialData }: Props) {
  const {
    query,
    setQuery,
    page,
    setPage,
    data: factions,
    totalPages,
    isLoading,
    error,
    refetch,
  } = usePaginatedData(getPaginatedFactionsAction, initialData);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher une faction"
          className="flex-1"
        />
        <CreateFactionModal onCreated={refetch} />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <FactionTable factions={factions || []} isLoading={isLoading} onDelete={refetch} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
