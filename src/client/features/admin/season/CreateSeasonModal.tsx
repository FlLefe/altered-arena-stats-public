'use client';

import { useState } from 'react';
import { CreateModal } from '@/client/components/shared';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSeasonAction } from '@/server/features/season/createSeasonAction';

type Props = {
  onCreated?: () => void;
};

export function CreateSeasonModal({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleError = useFormErrorHandler('Création de saison');

  const handleCreate = async () => {
    try {
      const result = await createSeasonAction({
        data: { name, startDate, endDate },
      });

      if (!result.success) {
        handleError(result);
        return;
      }

      setName('');
      setStartDate('');
      setEndDate('');
      onCreated?.();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <CreateModal title="Créer une saison" onSubmit={handleCreate} triggerLabel="Créer">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
    </CreateModal>
  );
}
