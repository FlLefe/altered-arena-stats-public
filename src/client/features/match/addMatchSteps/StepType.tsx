'use client';

import { Button } from '@/components/ui/button';
import { MatchType } from '@/server/features/match';

type Props = {
  matchType?: MatchType;
  onChange: (type: MatchType) => void;
  onNext: () => void;
};

export function StepType({ matchType, onChange, onNext }: Props) {
  const handleSelect = (type: MatchType) => {
    onChange(type);
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Quel type de match veux-tu créer ?</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          variant={matchType === 'FRIENDLY' ? 'default' : 'secondary'}
          onClick={() => handleSelect('FRIENDLY')}
          className="flex-1 text-base py-6"
        >
          Amical
        </Button>
        <Button
          variant={matchType === 'TOURNAMENT' ? 'default' : 'secondary'}
          onClick={() => handleSelect('TOURNAMENT')}
          className="flex-1 text-base py-6"
        >
          Tournoi
        </Button>
      </div>
    </div>
  );
}
