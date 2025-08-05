'use client';

import { useEffect, useState } from 'react';
import { EditModal } from '@/client/components/shared';
import { useFactions } from '@/client/hooks/useFactions';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PaginatedHeroDTO, updateHeroAction } from '@/server/features/hero';

type Props = {
  hero: PaginatedHeroDTO;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditHeroModal({ hero, open, onClose, onUpdated }: Props) {
  const [name, setName] = useState(hero.name);
  const [factionId, setFactionId] = useState(hero.faction.id);
  const { factions, isLoading, error } = useFactions();
  const handleError = useFormErrorHandler('Modification de héros');

  useEffect(() => {
    if (open) {
      setName(hero.name);
      setFactionId(hero.faction.id);
    }
  }, [open, hero]);

  const handleSubmit = async () => {
    try {
      const result = await updateHeroAction({ id: hero.id, data: { name, factionId } });

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
    <EditModal title="Modifier le héros" onSubmit={handleSubmit} open={open} onClose={onClose}>
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="faction">Faction</Label>
        {isLoading ? (
          <p className="text-sm text-muted">Chargement...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <Select value={factionId} onValueChange={setFactionId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une faction" />
            </SelectTrigger>
            <SelectContent>
              {factions.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </EditModal>
  );
}
