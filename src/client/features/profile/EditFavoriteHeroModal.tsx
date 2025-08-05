'use client';

import { useEffect, useState } from 'react';
import { HeroSelect } from 'src/components/ui/hero-select';
import { EditModal } from '@/client/components/shared';
import { useFactions } from '@/client/hooks/useFactions';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { Label } from '@/components/ui/label';
import { getAllHeroesAction } from '@/server/features/hero';
import { BaseHeroDTO } from '@/server/features/hero/HeroDTO';
import { updateOwnProfileAction } from '@/server/features/player/updateOwnProfileAction';

type Props = {
  currentHero: BaseHeroDTO | null;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function EditFavoriteHeroModal({ currentHero, open, onClose, onUpdated }: Props) {
  const [heroId, setHeroId] = useState(currentHero?.id || '');
  const [heroes, setHeroes] = useState<BaseHeroDTO[]>([]);
  const [isLoadingHeroes, setIsLoadingHeroes] = useState(false);
  const { factions, isLoading: isLoadingFactions, error: factionsError } = useFactions();
  const handleError = useFormErrorHandler('Modification du héros préféré');

  useEffect(() => {
    const loadHeroes = async () => {
      setIsLoadingHeroes(true);
      try {
        const heroesData = await getAllHeroesAction();
        setHeroes(heroesData);
      } catch (error) {
        console.error('Failed to load heroes:', error);
      } finally {
        setIsLoadingHeroes(false);
      }
    };
    loadHeroes();
  }, []);

  useEffect(() => {
    if (open) {
      setHeroId(currentHero?.id || '');
    }
  }, [open, currentHero]);

  const handleSubmit = async () => {
    try {
      const result = await updateOwnProfileAction({
        data: {
          favoriteFactionId: undefined,
          favoriteHeroId: heroId,
        },
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
      title="Modifier mon héros préféré"
      onSubmit={handleSubmit}
      open={open}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="hero">Héros préféré</Label>
          {isLoadingHeroes || isLoadingFactions ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : factionsError ? (
            <p className="text-sm text-destructive">{factionsError}</p>
          ) : (
            <HeroSelect
              value={heroId}
              onValueChange={(id: string) => setHeroId(id === 'none' ? '' : id)}
              heroes={heroes}
              factions={factions}
              placeholder="Choisir un héros"
            />
          )}
        </div>
      </div>
    </EditModal>
  );
}
