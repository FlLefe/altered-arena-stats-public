'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sanitizeString } from '@/lib/sanitization';

type Props = {
  comment: string;
  onChange: (comment: string) => void;
};

export function StepComment({ comment, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="comment">Commentaire (optionnel)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => {
            const sanitizedValue = sanitizeString(e.target.value.slice(0, 500));
            onChange(sanitizedValue);
          }}
          maxLength={500}
          placeholder="Commentaire facultatif"
          rows={4}
        />
        <p className="text-sm text-muted-foreground mt-1">{comment.length}/500 caractères</p>
      </div>
    </div>
  );
}
