'use client';

import { useState } from 'react';
import { useDeleteEntity } from '@/client/hooks';
import { Button } from '@/components/ui/button';
import { PaginatedEventDTO, deleteEventAction } from '@/server/features/event';
import { EditEventModal } from './EditEventModal';

type Props = {
  events: PaginatedEventDTO[];
  isLoading: boolean;
  onDelete?: () => void;
};

export function EventTable({ events, isLoading, onDelete }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<PaginatedEventDTO | null>(null);

  const { handleDelete, isPending: isDeleting } = useDeleteEntity(deleteEventAction, {
    onSuccessMessage: 'Événement supprimé avec succès.',
    onErrorMessage: 'Impossible de supprimer cet événement.',
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!events || events.length === 0)
    return <p className="text-muted-foreground">Aucun événement trouvé.</p>;

  return (
    <>
      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded border text-foreground bg-surface shadow-sm sm:grid sm:grid-cols-5 sm:items-center"
          >
            <div className="font-bold text-foreground">{event.name}</div>
            <div className="text-sm text-foreground">
              {event.eventType === 'DEFAULT' ? 'Par défaut' : 'Personnalisé'}
            </div>
            <div className="text-sm text-foreground">
              {event.startDate && event.endDate ? (
                <>
                  Du {new Date(event.startDate).toLocaleDateString()} au{' '}
                  {new Date(event.endDate).toLocaleDateString()}
                </>
              ) : (
                'Dates non définies'
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Créé le {new Date(event.createdAt).toLocaleDateString()}
            </div>
            <div className="flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
              <Button size="sm" onClick={() => setSelectedEvent(event)}>
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(event.id, onDelete)}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          open={true}
          onClose={() => setSelectedEvent(null)}
          onUpdated={() => {
            setSelectedEvent(null);
            onDelete?.();
          }}
        />
      )}
    </>
  );
}
