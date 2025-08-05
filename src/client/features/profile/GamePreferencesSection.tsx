'use client';

import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { FactionIcon } from '@/client/components/FactionIcon';
import { Button } from '@/components/ui/button';
import { BaseFactionDTO } from '@/server/features/faction/FactionDTO';
import { BaseHeroDTO } from '@/server/features/hero/HeroDTO';
import { EditFavoriteFactionModal } from './EditFavoriteFactionModal';
import { EditFavoriteHeroModal } from './EditFavoriteHeroModal';

type Props = {
  currentFaction: BaseFactionDTO | null;
  currentHero: BaseHeroDTO | null;
};

export function GamePreferencesSection({ currentFaction, currentHero }: Props) {
  const [isFactionModalOpen, setIsFactionModalOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  const handleFactionUpdated = () => {
    setIsFactionModalOpen(false);
    window.location.reload();
  };

  const handleHeroUpdated = () => {
    setIsHeroModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative overflow-hidden bg-stats-bg border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-indigo-400/30 to-transparent rounded-full blur-lg" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Préférences de jeu</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground">Votre faction de cœur</label>
            <div className="flex items-center justify-between gap-4 mt-3">
              {currentFaction && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl border border-border w-fit min-w-[200px] shadow-sm"
                  style={{ backgroundColor: `${currentFaction.colorCode}50` }}
                >
                  <FactionIcon
                    factionName={currentFaction.name}
                    color={currentFaction.colorCode}
                    size="md"
                    className="flex-shrink-0"
                  />
                  <span className="text-sm font-semibold">{currentFaction.name}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFactionModalOpen(true)}
                className="flex-shrink-0"
              >
                {currentFaction ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground">Votre héros favori</label>
            <div className="flex items-center justify-between gap-4 mt-3">
              {currentHero && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl border border-border w-fit min-w-[200px] shadow-sm"
                  style={{ backgroundColor: `${currentHero.faction.colorCode}50` }}
                >
                  <span className="text-sm font-semibold">{currentHero.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({currentHero.faction.name})
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsHeroModalOpen(true)}
                className="flex-shrink-0"
              >
                {currentHero ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditFavoriteFactionModal
        currentFaction={currentFaction}
        open={isFactionModalOpen}
        onClose={() => setIsFactionModalOpen(false)}
        onUpdated={handleFactionUpdated}
      />

      <EditFavoriteHeroModal
        currentHero={currentHero}
        open={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        onUpdated={handleHeroUpdated}
      />
    </div>
  );
}
