'use client';

import React, { Fragment, useRef, useEffect } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { FactionIcon } from '@/client/components/FactionIcon';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { BaseFactionDTO, BaseHeroDTO } from '@/server/features';

type HeroSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  heroes: BaseHeroDTO[];
  factions: BaseFactionDTO[];
  placeholder?: string;
  disabled?: boolean;
};

export function HeroSelect({
  value,
  onValueChange,
  heroes,
  factions,
  placeholder = 'Choisir un héros',
  disabled = false,
}: HeroSelectProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  // Group heroes by faction
  const heroesByFaction = heroes.reduce(
    (acc, hero) => {
      const factionId = hero.faction.id;
      if (!acc[factionId]) {
        acc[factionId] = [];
      }
      acc[factionId].push(hero);
      return acc;
    },
    {} as Record<string, BaseHeroDTO[]>,
  );

  // Find the selected hero to display its color
  const selectedHero = value && value !== 'none' ? heroes.find((hero) => hero.id === value) : null;

  // Force the scroll to the top when the menu opens
  useEffect(() => {
    if (isOpen && viewportRef.current) {
      setTimeout(() => {
        viewportRef.current?.scrollTo(0, 0);
      }, 0);
    }
  }, [isOpen]);

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger
        className="text-foreground"
        style={{
          backgroundColor: selectedHero
            ? `${selectedHero.faction.colorCode}60`
            : 'var(--color-input)',
          borderColor: 'var(--color-input-border)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-input-border-focus)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-input-border)';
        }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectPrimitive.Viewport
          ref={viewportRef}
          className="p-1 max-h-[300px] overflow-y-auto scroll-py-1"
        >
          <SelectItem value="none">Aucun</SelectItem>
          {factions.map((faction) => {
            const factionHeroes = heroesByFaction[faction.id] || [];
            if (factionHeroes.length === 0) return null;

            return (
              <Fragment key={faction.id}>
                {/* Non clickable faction header */}
                <div
                  className="px-3 py-2 text-sm font-medium text-muted-foreground cursor-default"
                  style={{ backgroundColor: `${faction.colorCode}25` }}
                >
                  <div className="flex items-center gap-2">
                    <FactionIcon
                      factionName={faction.name}
                      color={faction.colorCode}
                      size="md"
                      className="flex-shrink-0"
                    />
                    {faction.name}
                  </div>
                </div>

                {/* Heroes of this faction */}
                {factionHeroes.map((hero) => (
                  <SelectItem
                    key={hero.id}
                    value={hero.id}
                    className="pl-6"
                    style={{ backgroundColor: `${faction.colorCode}60` }}
                  >
                    {hero.name}
                  </SelectItem>
                ))}
              </Fragment>
            );
          })}
        </SelectPrimitive.Viewport>
      </SelectContent>
    </Select>
  );
}
