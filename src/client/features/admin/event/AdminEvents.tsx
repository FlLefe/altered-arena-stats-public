'use client';

import { Pagination } from '@/client/components/shared/Pagination';
import { SearchInput } from '@/client/components/shared/SearchInput';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';
import { getPaginatedEventsAction, PaginatedEventDTO } from '@/server/features/event';
import { CreateEventModal } from './CreateEventModal';
import { EventTable } from './EventTable';

type Props = {
  initialData: PaginatedEventDTO[];
};

export function AdminEvents({ initialData }: Props) {
  const {
    query,
    setQuery,
    page,
    setPage,
    data: events,
    totalPages,
    isLoading,
    error,
    refetch,
  } = usePaginatedData(getPaginatedEventsAction, initialData);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher un événement"
          className="flex-1"
        />
        <CreateEventModal onCreated={refetch} />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <EventTable events={events || []} isLoading={isLoading} onDelete={refetch} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
