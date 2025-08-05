'use client';

import { Pagination, SearchInput, FilterSelect, FilterContainer } from '@/client/components/shared';
import { usePaginatedDataWithFilters, useFactions, useHeroes } from '@/client/hooks';
import { getPaginatedPlayersAction, PaginatedPlayerDTO } from '@/server/features/player';
import { PlayerTable } from './PlayerTable';

type Props = {
  initialData: PaginatedPlayerDTO[];
};

export function AdminPlayers({ initialData }: Props) {
  const {
    data: players,
    page,
    setPage,
    query,
    setQuery,
    totalPages,
    isLoading,
    error,
    refetch,
    activeFilters,
    setFilter,
  } = usePaginatedDataWithFilters({
    action: getPaginatedPlayersAction,
    initialData,
  });

  const { factions } = useFactions();
  const { heroes } = useHeroes();

  // Options for filters
  const roleOptions = [
    { value: 'all', label: 'Tous les rôles' },
    { value: 'user', label: 'Utilisateur' },
    { value: 'admin', label: 'Administrateur' },
  ];

  const factionOptions = [
    { value: 'all', label: 'Toutes les factions' },
    ...(factions?.map((faction) => ({ value: faction.id, label: faction.name })) || []),
  ];

  const heroOptions = [
    { value: 'all', label: 'Tous les héros' },
    ...(heroes?.map((hero) => ({ value: hero.id, label: hero.name })) || []),
  ];

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="Rechercher un joueur" />

      <FilterContainer>
        <FilterSelect
          value={activeFilters.roleFilter || 'all'}
          onValueChange={(value) => setFilter('roleFilter', value)}
          options={roleOptions}
          placeholder="Rôle"
        />
        <FilterSelect
          value={activeFilters.factionFilter || 'all'}
          onValueChange={(value) => setFilter('factionFilter', value)}
          options={factionOptions}
          placeholder="Faction"
          width="w-48"
        />
        <FilterSelect
          value={activeFilters.heroFilter || 'all'}
          onValueChange={(value) => setFilter('heroFilter', value)}
          options={heroOptions}
          placeholder="Héros"
          width="w-48"
        />
      </FilterContainer>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <PlayerTable players={players || []} isLoading={isLoading} onDelete={refetch} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
