'use client';

import { useEffect, useState } from 'react';
import { EditModal } from '@/client/components/shared';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaginatedFactionDTO, updateFactionAction } from '@/server/features/faction';

type Props = {
  faction: PaginatedFactionDTO;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditFactionModal({ faction, open, onClose, onUpdated }: Props) {
  const [name, setName] = useState(faction.name);
  const [colorCode, setColorCode] = useState(faction.colorCode);
  const handleError = useFormErrorHandler('Modification de faction');

  useEffect(() => {
    if (open) {
      setName(faction.name);
      setColorCode(faction.colorCode);
    }
  }, [open, faction]);

  const handleSubmit = async () => {
    try {
      const result = await updateFactionAction({
        id: faction.id,
        data: { name, colorCode },
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
    <EditModal title="Modifier la faction" onSubmit={handleSubmit} open={open} onClose={onClose}>
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="colorCode">Code couleur (hex)</Label>
        <Input
          id="colorCode"
          type="color"
          value={colorCode}
          onChange={(e) => setColorCode(e.target.value)}
        />
      </div>
    </EditModal>
  );
}
