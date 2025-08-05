'use client';

import { useEffect, useState } from 'react';
import { FactionIcon } from '@/client/components/FactionIcon';
import { EditModal } from '@/client/components/shared';
import { useFactions } from '@/client/hooks/useFactions';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BaseFactionDTO } from '@/server/features/faction/FactionDTO';
import { updateOwnProfileAction } from '@/server/features/player/updateOwnProfileAction';

type Props = {
  currentFaction: BaseFactionDTO | null;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditFavoriteFactionModal({ currentFaction, open, onClose, onUpdated }: Props) {
  const [factionId, setFactionId] = useState(currentFaction?.id || '');
  const { factions, isLoading, error } = useFactions();
  const handleError = useFormErrorHandler('Modification de la faction préférée');

  useEffect(() => {
    if (open) {
      setFactionId(currentFaction?.id || '');
    }
  }, [open, currentFaction]);

  const handleSubmit = async () => {
    try {
      const result = await updateOwnProfileAction({
        data: { favoriteFactionId: factionId },
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
    <EditModal
      title="Modifier ma faction préférée"
      onSubmit={handleSubmit}
      open={open}
      onClose={onClose}
    >
      <div>
        <Label htmlFor="faction">Faction préférée</Label>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <Select
            value={factionId}
            onValueChange={(value) => setFactionId(value === 'none' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une faction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              {factions.map((faction) => (
                <SelectItem key={faction.id} value={faction.id}>
                  <div className="flex items-center gap-2">
                    <FactionIcon factionName={faction.name} color={faction.colorCode} size="md" />
                    {faction.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </EditModal>
  );
}
