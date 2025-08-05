'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  AdminPlayers,
  AdminEvents,
  AdminFactions,
  AdminHeroes,
  AdminSeasons,
  AdminMatches,
  AdminGames,
} from '@/client/features/admin';
import {
  PaginatedEventDTO,
  BaseFactionDTO,
  BaseHeroDTO,
  PaginatedPlayerDTO,
  PaginatedSeasonDTO,
  PaginatedMatchDTO,
  PaginatedGameDTO,
} from '@/server/features';

type Props = {
  initialUsers: PaginatedPlayerDTO[];
  initialSeasons: PaginatedSeasonDTO[];
  initialFactions: BaseFactionDTO[];
  initialHeroes: BaseHeroDTO[];
  initialEvents: PaginatedEventDTO[];
  initialMatches: PaginatedMatchDTO[];
  initialGames: PaginatedGameDTO[];
};

export default function AdminTabs({
  initialUsers,
  initialSeasons,
  initialFactions,
  initialHeroes,
  initialEvents,
  initialMatches,
  initialGames,
}: Props) {
  const [tab, setTab] = useState('users');

  return (
    <Tabs.Root value={tab} onValueChange={setTab} className="w-full">
      <Tabs.List className="flex flex-wrap gap-2 border-b border-border mb-4">
        <Tabs.Trigger value="users" className={getTriggerStyle(tab === 'users')}>
          Utilisateurs
        </Tabs.Trigger>
        <Tabs.Trigger value="events" className={getTriggerStyle(tab === 'events')}>
          Événements
        </Tabs.Trigger>
        <Tabs.Trigger value="seasons" className={getTriggerStyle(tab === 'seasons')}>
          Saisons
        </Tabs.Trigger>
        <Tabs.Trigger value="factions" className={getTriggerStyle(tab === 'factions')}>
          Factions
        </Tabs.Trigger>
        <Tabs.Trigger value="heroes" className={getTriggerStyle(tab === 'heroes')}>
          Héros
        </Tabs.Trigger>
        <Tabs.Trigger value="matches" className={getTriggerStyle(tab === 'matches')}>
          Matches
        </Tabs.Trigger>
        <Tabs.Trigger value="games" className={getTriggerStyle(tab === 'games')}>
          Games
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="users">
        <AdminPlayers initialData={initialUsers} />
      </Tabs.Content>
      <Tabs.Content value="events">
        <AdminEvents initialData={initialEvents} />
      </Tabs.Content>
      <Tabs.Content value="seasons">
        <AdminSeasons initialData={initialSeasons} />
      </Tabs.Content>
      <Tabs.Content value="factions">
        <AdminFactions initialData={initialFactions} />
      </Tabs.Content>
      <Tabs.Content value="heroes">
        <AdminHeroes initialData={initialHeroes} />
      </Tabs.Content>
      <Tabs.Content value="matches">
        <AdminMatches initialData={initialMatches} />
      </Tabs.Content>
      <Tabs.Content value="games">
        <AdminGames initialData={initialGames} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

function getTriggerStyle(isActive: boolean): string {
  return `min-w-fit px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
    isActive
      ? 'border-primary text-primary'
      : 'border-transparent text-muted-foreground hover:text-primary'
  }`;
}
