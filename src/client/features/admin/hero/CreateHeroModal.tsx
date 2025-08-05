'use client';

import { useState, useEffect } from 'react';
import { CreateModal } from '@/client/components/shared';
import { useFormErrorHandler } from '@/client/hooks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllFactionsAction } from '@/server/features/faction';
import { BaseFactionDTO } from '@/server/features/faction';
import { createHeroAction } from '@/server/features/hero';

type Props = {
  onCreated?: () => void;
};

export function CreateHeroModal({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [factionId, setFactionId] = useState('');
  const [factions, setFactions] = useState<BaseFactionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleError = useFormErrorHandler('Création de héros');

  // Load factions from server action
  useEffect(() => {
    const loadFactions = async () => {
      try {
        const cachedFactions = await getAllFactionsAction();
        setFactions(cachedFactions);
      } catch (err) {
        setError('Erreur lors du chargement des factions');
        console.error('Error loading factions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFactions();
  }, []);

  const handleCreate = async () => {
    try {
      const result = await createHeroAction({ data: { name, factionId } });

      if (!result.success) {
        handleError(result);
        return;
      }

      setName('');
      setFactionId('');
      onCreated?.();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <CreateModal title="Créer un héros" onSubmit={handleCreate} triggerLabel="Créer">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="faction">Faction</Label>
        {loading ? (
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
    </CreateModal>
  );
}
