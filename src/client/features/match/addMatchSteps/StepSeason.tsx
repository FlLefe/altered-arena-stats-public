'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';

type Props = {
  seasonId: string;
  seasons: BaseSeasonDTO[];
  onChange: (seasonId: string) => void;
};

export function StepSeason({ seasonId, seasons, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="season">Saison</Label>
        <Select value={seasonId} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une saison" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
