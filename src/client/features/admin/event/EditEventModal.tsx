'use client';

import { useEffect, useState } from 'react';
import { EditModal } from '@/client/components/shared';
import { useSeasons } from '@/client/hooks';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PaginatedEventDTO, updateEventAction } from '@/server/features/event';

type Props = {
  event: PaginatedEventDTO;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditEventModal({ event, open, onClose, onUpdated }: Props) {
  const [name, setName] = useState(event.name);
  const [eventType, setEventType] = useState<'DEFAULT' | 'CUSTOM'>(event.eventType);
  const [startDate, setStartDate] = useState(event.startDate ? event.startDate.slice(0, 10) : '');
  const [endDate, setEndDate] = useState(event.endDate ? event.endDate.slice(0, 10) : '');
  const [seasonId, setSeasonId] = useState(event.seasonId);

  const { seasons, isLoading, error } = useSeasons();
  const { handleError, handleSuccess } = useErrorHandler();

  useEffect(() => {
    if (open) {
      setName(event.name);
      setEventType(event.eventType);
      setStartDate(event.startDate ? event.startDate.slice(0, 10) : '');
      setEndDate(event.endDate ? event.endDate.slice(0, 10) : '');
      setSeasonId(event.seasonId);
    }
  }, [open, event]);

  const handleSubmit = async () => {
    try {
      // Date validation
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        handleError('La date de fin doit être après la date de début');
        return;
      }

      const result = await updateEventAction({
        id: event.id,
        data: {
          name,
          eventType,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          seasonId: seasonId || undefined,
        },
      });

      if (!result.success) {
        handleError(result.error || "Une erreur s'est produite");
        return;
      }

      handleSuccess('Événement modifié avec succès');
      onUpdated?.();
    } catch {
      handleError("Une erreur inattendue s\'est produite");
    }
  };

  return (
    <EditModal title="Modifier l'événement" onSubmit={handleSubmit} open={open} onClose={onClose}>
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Label htmlFor="eventType">Type d'événement</Label>
        <Select
          value={eventType}
          onValueChange={(value: 'DEFAULT' | 'CUSTOM') => setEventType(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEFAULT">Par défaut</SelectItem>
            <SelectItem value="CUSTOM">Personnalisé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="startDate">Date de début (optionnel)</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="endDate">Date de fin (optionnel)</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="season">Saison (optionnel)</Label>
        {isLoading ? (
          <p className="text-sm text-muted">Chargement...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <Select
            value={seasonId || 'none'}
            onValueChange={(value) => setSeasonId(value === 'none' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une saison (optionnel)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune saison</SelectItem>
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </EditModal>
  );
}
