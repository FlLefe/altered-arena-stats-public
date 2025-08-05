'use client';

import { useState } from 'react';
import { CreateModal } from '@/client/components/shared';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { useSeasons } from '@/client/hooks/useSeasons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { createEventAction } from '@/server/features/event/createEventAction';

type Props = {
  onCreated?: () => void;
};

export function CreateEventModal({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState<'DEFAULT' | 'CUSTOM'>('CUSTOM');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [seasonId, setSeasonId] = useState('');
  const { seasons, isLoading, error } = useSeasons();
  const { handleError, handleSuccess } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      // Date validation
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        handleError('La date de fin doit être après la date de début');
        return;
      }

      const result = await createEventAction({
        data: {
          name,
          eventType,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          seasonId: eventType !== 'DEFAULT' && seasonId ? seasonId : undefined,
        },
      });

      if (!result.success) {
        handleError(result.error || "Une erreur s'est produite");
        return;
      }

      handleSuccess('Événement créé avec succès');
      setName('');
      setEventType('CUSTOM');
      setStartDate('');
      setEndDate('');
      setSeasonId('');
      onCreated?.();
    } catch {
      handleError("Une erreur inattendue s\'est produite");
    }
  };

  return (
    <CreateModal title="Créer un événement" onSubmit={handleSubmit} triggerLabel="Créer">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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
      {eventType !== 'DEFAULT' && (
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
      )}
    </CreateModal>
  );
}
