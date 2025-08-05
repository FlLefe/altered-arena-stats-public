'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FactionIcon } from '@/client/components/FactionIcon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  playerHeroId: string;
  opponentHeroId: string;
  onChange: (playerHeroId: string, opponentHeroId: string) => void;
  onNext: () => void;
  gameFormData: {
    factions: Array<{
      id: string;
      name: string;
      colorCode: string;
    }>;
    heroes: Array<{
      id: string;
      name: string;
      imageUrl: string | null;
      faction: {
        id: string;
        name: string;
        colorCode: string;
      };
    }>;
  } | null;
};

export function StepHeroes({
  playerHeroId,
  opponentHeroId,
  onChange,
  onNext,
  gameFormData,
}: Props) {
  const [selectedPlayerFaction, setSelectedPlayerFaction] = useState('');
  const [selectedOpponentFaction, setSelectedOpponentFaction] = useState('');
  const router = useRouter();

  const factions = gameFormData?.factions || [];
  const heroes = gameFormData?.heroes || [];
  const loading = !gameFormData;

  const playerHeroes = heroes.filter((hero) => hero.faction.id === selectedPlayerFaction);
  const opponentHeroes = heroes.filter((hero) => hero.faction.id === selectedOpponentFaction);

  const handlePlayerFactionChange = (factionId: string) => {
    setSelectedPlayerFaction(factionId);
    onChange('', opponentHeroId); // Reset player hero when faction changes
  };

  const handleOpponentFactionChange = (factionId: string) => {
    setSelectedOpponentFaction(factionId);
    onChange(playerHeroId, ''); // Reset opponent hero when faction changes
  };

  const handlePlayerHeroChange = (heroId: string) => {
    onChange(heroId, opponentHeroId);
  };

  const handleOpponentHeroChange = (heroId: string) => {
    onChange(playerHeroId, heroId);
  };

  const canProceed = playerHeroId && opponentHeroId;

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sélection des héros</h2>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Sélection des héros</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Player Hero Selection */}
        <div className="space-y-4">
          <h3 className="font-medium">Ton héros</h3>

          <div className="space-y-3">
            <div>
              <Label htmlFor="player-faction">Faction</Label>
              <Select value={selectedPlayerFaction} onValueChange={handlePlayerFactionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une faction" />
                </SelectTrigger>
                <SelectContent>
                  {factions.map((faction) => (
                    <SelectItem key={faction.id} value={faction.id}>
                      <div className="flex items-center gap-2">
                        <FactionIcon
                          factionName={faction.name}
                          color={faction.colorCode}
                          size="md"
                        />
                        {faction.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlayerFaction && (
              <div>
                <Label htmlFor="player-hero">Héros</Label>
                <Select value={playerHeroId} onValueChange={handlePlayerHeroChange}>
                  <SelectTrigger
                    className="text-foreground"
                    style={
                      playerHeroId
                        ? {
                            backgroundColor: `${playerHeroes.find((h) => h.id === playerHeroId)?.faction.colorCode}50`,
                          }
                        : {}
                    }
                  >
                    <SelectValue placeholder="Choisir un héros" />
                  </SelectTrigger>
                  <SelectContent>
                    {playerHeroes.map((hero) => (
                      <SelectItem
                        key={hero.id}
                        value={hero.id}
                        style={{ backgroundColor: `${hero.faction.colorCode}45` }}
                      >
                        {hero.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Opponent Hero Selection */}
        <div className="space-y-4">
          <h3 className="font-medium">Héros de l&apos;adversaire</h3>

          <div className="space-y-3">
            <div>
              <Label htmlFor="opponent-faction">Faction</Label>
              <Select value={selectedOpponentFaction} onValueChange={handleOpponentFactionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une faction" />
                </SelectTrigger>
                <SelectContent>
                  {factions.map((faction) => (
                    <SelectItem key={faction.id} value={faction.id}>
                      <div className="flex items-center gap-2">
                        <FactionIcon
                          factionName={faction.name}
                          color={faction.colorCode}
                          size="sm"
                        />
                        {faction.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedOpponentFaction && (
              <div>
                <Label htmlFor="opponent-hero">Héros</Label>
                <Select value={opponentHeroId} onValueChange={handleOpponentHeroChange}>
                  <SelectTrigger
                    className="text-foreground"
                    style={
                      opponentHeroId
                        ? {
                            backgroundColor: `${opponentHeroes.find((h) => h.id === opponentHeroId)?.faction.colorCode}50`,
                          }
                        : {}
                    }
                  >
                    <SelectValue placeholder="Choisir un héros" />
                  </SelectTrigger>
                  <SelectContent>
                    {opponentHeroes.map((hero) => (
                      <SelectItem
                        key={hero.id}
                        value={hero.id}
                        style={{ backgroundColor: `${hero.faction.colorCode}45` }}
                      >
                        {hero.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/matches')}
          className="w-40"
        >
          Revenir à mes parties
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="w-40">
          Suivant
        </Button>
      </div>
    </div>
  );
}
