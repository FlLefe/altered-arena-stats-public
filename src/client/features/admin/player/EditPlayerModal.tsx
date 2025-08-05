'use client';

import { useEffect, useState } from 'react';
import { EditModal } from '@/client/components/shared';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updatePlayerAction, PlayerWithIdDTO } from '@/server/features/player';

type Props = {
  player: PlayerWithIdDTO;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditPlayerModal({ player, open, onClose, onUpdated }: Props) {
  const [alias, setAlias] = useState(player.alteredAlias);
  const [role, setRole] = useState<PlayerWithIdDTO['role']>(player.role);
  const handleError = useFormErrorHandler('Modification du joueur');

  useEffect(() => {
    if (open) {
      setAlias(player.alteredAlias);
      setRole(player.role);
    }
  }, [open, player]);

  const handleSubmit = async () => {
    try {
      const result = await updatePlayerAction({
        id: player.id,
        data: { alteredAlias: alias, role },
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
    <EditModal title="Modifier le joueur" onSubmit={handleSubmit} open={open} onClose={onClose}>
      <div>
        <Label htmlFor="alteredAlias">Pseudo Altered</Label>
        <Input
          id="alteredAlias"
          className="text-background"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select value={role} onValueChange={(value) => setRole(value as PlayerWithIdDTO['role'])}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </EditModal>
  );
}
