'use client';

import { Label } from '@/components/ui/label';
import { OpponentInput } from './OpponentInput';

type Props = {
  opponentName: string;
  onChange: (opponentName: string) => void;
};

export function StepOpponent({ opponentName, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="opponent">Adversaire</Label>
        <OpponentInput value={opponentName} onChange={onChange} />
      </div>
    </div>
  );
}
