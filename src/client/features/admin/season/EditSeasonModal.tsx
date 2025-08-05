'use client';

import { useEffect, useState } from 'react';
import { EditModal } from '@/client/components/shared';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaginatedSeasonDTO } from '@/server/features';
import { updateSeasonAction } from '@/server/features/season/updateSeasonAction';

type Props = {
  season: PaginatedSeasonDTO;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditSeasonModal({ season, open, onClose, onUpdated }: Props) {
  const [name, setName] = useState(season.name);
  const [startDate, setStartDate] = useState(season.startDate.slice(0, 10));
  const [endDate, setEndDate] = useState(season.endDate.slice(0, 10));
  const handleError = useFormErrorHandler('Modification de saison');

  useEffect(() => {
    if (open) {
      setName(season.name);
      setStartDate(season.startDate.slice(0, 10));
      setEndDate(season.endDate.slice(0, 10));
    }
  }, [open, season]);

  const handleSubmit = async () => {
    try {
      const result = await updateSeasonAction({
        id: season.id,
        data: { name, startDate, endDate },
      });

      if (!result.success) {
        handleError(result);
        return;
      }

      onUpdated?.();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <EditModal title="Modifier la saison" onSubmit={handleSubmit} open={open} onClose={onClose}>
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </EditModal>
  );
}
