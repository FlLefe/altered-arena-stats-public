'use client';

import React, { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { FactionIcon } from '@/client/components/FactionIcon';
import { useUserSession } from '@/client/features/session/useSession';
import { useErrorHandler, useAliasValidation } from '@/client/hooks';
import { Button } from '@/components/ui/button';
import { HeroSelect } from '@/components/ui/hero-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import {
  BaseFactionDTO,
  BaseHeroDTO,
  completeOnboardingAction,
  getUserSession,
} from '@/server/features';

type OnboardingFormProps = {
  factions: BaseFactionDTO[];
  heroes: BaseHeroDTO[];
};

export function OnboardingForm({ factions, heroes }: OnboardingFormProps) {
  const router = useRouter();
  const { handleError, handleSuccess } = useErrorHandler();
  const { setUser } = useUserSession();

  const [formData, setFormData] = useState({
    alteredAlias: '',
    favoriteFactionId: '',
    favoriteHeroId: '',
  });

  const [isPending, startTransition] = useTransition();

  // Real-time alias validation
  const aliasValidation = useAliasValidation(formData.alteredAlias);

  const onFactionChange = (factionId: string) => {
    setFormData({
      ...formData,
      favoriteFactionId: factionId,
      favoriteHeroId: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side alias validation before submission
    if (!aliasValidation.isValid) {
      handleError(aliasValidation.error || 'Pseudo invalide');
      return;
    }

    startTransition(async () => {
      try {
        const result = await completeOnboardingAction({ data: formData });

        if (result.success) {
          handleSuccess('Profil configuré avec succès ! Bienvenue !');

          // Optimistic update of the session with the new data
          const currentUser = await getUserSession();
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              alteredAlias: formData.alteredAlias,
              profileComplete: true,
            };
            startTransition(() => {
              setUser(updatedUser);
            });
          }

          // Redirect to the home page after onboarding
          router.push('/');
        } else {
          handleError(result.error || "Une erreur s'est produite");
        }
      } catch {
        handleError("Une erreur inattendue s'est produite");
      }
    });
  };

  const getAliasStatusIcon = () => {
    if (aliasValidation.isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    if (aliasValidation.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (aliasValidation.error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Configuration de votre profil</h1>
        <p className="text-muted-foreground">
          Personnalisez votre profil pour commencer à utiliser l&apos;application
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="alteredAlias">Pseudo Altered *</Label>
          <div className="relative">
            <Input
              id="alteredAlias"
              placeholder="Ex : Pseudo_1234"
              required
              value={formData.alteredAlias}
              onChange={(e) => setFormData({ ...formData, alteredAlias: e.target.value })}
              maxLength={20}
            />
            {getAliasStatusIcon() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getAliasStatusIcon()}
              </div>
            )}
          </div>
          {aliasValidation.error && (
            <p className="text-sm text-red-500 mt-1">{aliasValidation.error}</p>
          )}
          {aliasValidation.isValid && (
            <p className="text-sm text-green-500 mt-1">Pseudo disponible</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            3-20 caractères, lettres, chiffres, tirets et underscores uniquement
          </p>
        </div>

        <div className="space-y-4">
          <Label htmlFor="favoriteFactionId">Faction de cœur (optionnelle)</Label>
          <Select
            value={formData.favoriteFactionId || ''}
            onValueChange={(value) => onFactionChange(value === 'none' ? '' : value)}
          >
            <SelectTrigger
              className="text-foreground"
              style={{
                backgroundColor: 'var(--color-input)',
                borderColor: 'var(--color-input-border)',
              }}
            >
              <SelectValue placeholder="Choisir une faction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              {factions.map((faction) => (
                <SelectItem key={faction.id} value={String(faction.id)}>
                  <div className="flex items-center gap-2">
                    <FactionIcon factionName={faction.name} color={faction.colorCode} size="md" />
                    {faction.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="favoriteHeroId">Héros préféré (optionnel)</Label>
          <HeroSelect
            value={formData.favoriteHeroId || ''}
            onValueChange={(id: string) =>
              setFormData({ ...formData, favoriteHeroId: id === 'none' ? '' : id })
            }
            heroes={heroes}
            factions={factions}
            placeholder="Choisir un héros"
          />
        </div>

        <div className="flex justify-center pt-4">
          <Button type="submit" disabled={isPending || !aliasValidation.isValid} className="w-full">
            {isPending ? 'Configuration...' : 'Compléter le profil'}
          </Button>
        </div>
      </form>
    </div>
  );
}
