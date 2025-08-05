'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Pagination, SearchInput, FilterSelect, FilterContainer } from '@/client/components/shared';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';
import { Button } from '@/components/ui/button';
import { MAX_IN_PROGRESS_MATCHES } from '@/constants/match';
import { getPaginatedUserMatchesAction } from '@/server/features/game/getPaginatedUserMatchesAction';
import { PaginatedMatchDTO } from '@/server/features/match';
import { MatchCard } from './MatchCard';

type Props = {
  initialMatches: PaginatedMatchDTO[];
};

type FilterStatus = 'all' | 'IN_PROGRESS' | 'finished' | 'WIN' | 'LOSS' | 'DRAW';
type FilterType = 'all' | 'TOURNAMENT' | 'FRIENDLY';
type FilterEvent =
  | 'all'
  | 'Tournoi en ligne'
  | 'Championnat régional'
  | 'Tournoi de qualification'
  | 'Tournoi en boutique';

export function MatchesContainer({ initialMatches }: Props) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [eventFilter, setEventFilter] = useState<FilterEvent>('all');
  const router = useRouter();

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    page,
    setPage,
    data: matches,
    totalPages,
    error,
    refetch,
  } = usePaginatedData(getPaginatedUserMatchesAction, initialMatches);

  const filteredMatches = useMemo(() => {
    let filtered = matches || [];

    // Filter by status (client-side filtering for now)
    if (statusFilter === 'IN_PROGRESS') {
      filtered = filtered.filter((match) => match.matchStatus === 'IN_PROGRESS');
    } else if (statusFilter === 'finished') {
      filtered = filtered.filter((match) => match.matchStatus !== 'IN_PROGRESS');
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter((match) => match.matchStatus === statusFilter);
    }

    // Filter by match type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((match) => match.matchType === typeFilter);
    }

    // Filter by specific event
    if (eventFilter !== 'all') {
      filtered = filtered.filter((match) => {
        return match.event?.name === eventFilter;
      });
    }

    // Sort: IN_PROGRESS matches first, then by creation date (newest first)
    filtered.sort((a, b) => {
      // If one is IN_PROGRESS and the other is not, IN_PROGRESS first
      if (a.matchStatus === 'IN_PROGRESS' && b.matchStatus !== 'IN_PROGRESS') {
        return -1;
      }
      if (a.matchStatus !== 'IN_PROGRESS' && b.matchStatus === 'IN_PROGRESS') {
        return 1;
      }

      // Otherwise, sort by creation date (most recent first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [matches, statusFilter, typeFilter, eventFilter]);

  const inProgressMatches = (matches || []).filter((match) => match.matchStatus === 'IN_PROGRESS');

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'finished', label: 'Terminés' },
    { value: 'WIN', label: 'Victoires' },
    { value: 'LOSS', label: 'Défaites' },
    { value: 'DRAW', label: 'Égalités' },
  ];

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'TOURNAMENT', label: 'Tournoi' },
    { value: 'FRIENDLY', label: 'Amical' },
  ];

  const eventOptions = [
    { value: 'all', label: 'Tous les événements' },
    { value: 'Tournoi en ligne', label: 'Tournoi en ligne' },
    { value: 'Championnat régional', label: 'Championnat régional' },
    { value: 'Tournoi de qualification', label: 'Tournoi de qualification' },
    { value: 'Tournoi en boutique', label: 'Tournoi en boutique' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center pt-8">
        <Button onClick={() => router.push('/dashboard/match/add')} className="text-lg px-8 py-4">
          Ajouter un match
        </Button>
      </div>

      {/* Warning message for in-progress matches */}
      {inProgressMatches.length >= MAX_IN_PROGRESS_MATCHES && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-200">
          <p className="font-medium">
            Vous avez {inProgressMatches.length} matchs en cours, clôturez-en un pour en créer un
            nouveau.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Search */}
        <div className="w-full">
          <SearchInput
            placeholder="Rechercher par adversaire, saison, événement..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Filters */}
        <FilterContainer>
          <FilterSelect
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as FilterStatus)}
            options={statusOptions}
            placeholder="Statut"
          />
          <FilterSelect
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as FilterType)}
            options={typeOptions}
            placeholder="Type"
          />
          <FilterSelect
            value={eventFilter}
            onValueChange={(value) => setEventFilter(value as FilterEvent)}
            options={eventOptions}
            placeholder="Événement"
            width="w-48"
          />
        </FilterContainer>
      </div>

      {/* Error message */}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* Matches grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {searchQuery ||
          statusFilter !== 'all' ||
          typeFilter !== 'all' ||
          eventFilter !== 'all' ? (
            <p>Aucun match trouvé avec ces critères.</p>
          ) : (
            <div className="space-y-4">
              <p>Vous n&apos;avez pas encore de parties enregistrées.</p>
              <Button onClick={() => router.push('/dashboard/match/add')}>
                Créer votre premier match
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} onMatchClosed={refetch} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
