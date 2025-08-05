'use client';

import { Label } from '@/components/ui/label';
import { EventInput } from './EventInput';

type Props = {
  eventId: string;
  onChange: (eventId: string) => void;
};

export function StepEvent({ eventId, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="event">Tournoi (optionnel)</Label>
        <EventInput value={eventId} onChange={onChange} />
      </div>
    </div>
  );
}
