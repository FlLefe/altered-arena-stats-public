'use client';

import { Pagination } from '@/client/components/shared/Pagination';
import { SearchInput } from '@/client/components/shared/SearchInput';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';
import { getPaginatedHeroesAction, PaginatedHeroDTO } from '@/server/features/hero';
import { CreateHeroModal } from './CreateHeroModal';
import { HeroTable } from './HeroTable';

type Props = {
  initialData: PaginatedHeroDTO[];
};

export function AdminHeroes({ initialData }: Props) {
  const {
    query,
    setQuery,
    page,
    setPage,
    data: heroes,
    totalPages,
    isLoading,
    error,
    refetch,
  } = usePaginatedData(getPaginatedHeroesAction, initialData);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher un héros"
          className="flex-1"
        />
        <CreateHeroModal onCreated={refetch} />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <HeroTable heroes={heroes || []} isLoading={isLoading} onDelete={refetch} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
