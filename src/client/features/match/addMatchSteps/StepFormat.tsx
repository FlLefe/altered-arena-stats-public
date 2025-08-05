'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { matchFormatEnum, MatchFormat } from '@/server/features/match';

type Props = {
  format: MatchFormat;
  onChange: (format: MatchFormat) => void;
};

export function StepFormat({ format, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="format">Format</Label>
        <Select value={format} onValueChange={(value) => onChange(value as MatchFormat)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un format" />
          </SelectTrigger>
          <SelectContent>
            {matchFormatEnum.options.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
