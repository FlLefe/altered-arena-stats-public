'use client';

import { useState } from 'react';
import { CreateModal } from '@/client/components/shared';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFactionAction } from '@/server/features/faction/createFactionAction';

type Props = {
  onCreated?: () => void;
};

export function CreateFactionModal({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [colorCode, setColorCode] = useState('');
  const handleError = useFormErrorHandler('Création de faction');

  const handleCreate = async () => {
    try {
      await createFactionAction({ data: { name, colorCode } });
      setName('');
      setColorCode('');
      onCreated?.();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <CreateModal title="Créer une faction" onSubmit={handleCreate} triggerLabel="Créer">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="colorCode">Code couleur (hex)</Label>
        <Input
          id="colorCode"
          type="color"
          value={colorCode}
          onChange={(e) => setColorCode(e.target.value)}
          required
        />
      </div>
    </CreateModal>
  );
}
