'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sanitizeString } from '@/lib/sanitization';

type Props = {
  gameStatus: 'WIN' | 'LOSS' | 'DRAW';
  comment: string;
  onChange: (gameStatus: 'WIN' | 'LOSS' | 'DRAW', comment: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
};

export function StepResult({
  gameStatus,
  comment,
  onChange,
  onSubmit,
  onBack,
  loading = false,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Résultat et commentaire</h2>
        <p className="text-muted-foreground mb-6">
          Choisissez le résultat de cette game et ajoutez un commentaire optionnel.
        </p>
      </div>

      {/* Game Status Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Résultat de la game</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="status"
            onClick={() => onChange('WIN', comment)}
            disabled={loading}
            className={`flex-1 ${
              gameStatus === 'WIN'
                ? '!bg-green-600 !border-green-600 hover:!bg-green-700 !text-white'
                : '!bg-green-50 !border-green-600 !text-green-700 hover:!bg-green-100 hover:!text-green-800 dark:!bg-green-900/30 dark:!border-green-700 dark:!text-green-300 dark:hover:!bg-green-900/50 dark:hover:!text-green-200'
            }`}
          >
            Victoire
          </Button>
          <Button
            variant="status"
            onClick={() => onChange('LOSS', comment)}
            disabled={loading}
            className={`flex-1 ${
              gameStatus === 'LOSS'
                ? '!bg-red-600 !border-red-600 hover:!bg-red-700 !text-white'
                : '!bg-red-50 !border-red-600 !text-red-700 hover:!bg-red-100 hover:!text-red-800 dark:!bg-red-900/30 dark:!border-red-800 dark:!text-red-300 dark:hover:!bg-red-900/50 dark:hover:!text-red-200'
            }`}
          >
            Défaite
          </Button>
          <Button
            variant="status"
            onClick={() => onChange('DRAW', comment)}
            disabled={loading}
            className={`flex-1 ${
              gameStatus === 'DRAW'
                ? '!bg-yellow-600 !border-yellow-600 hover:!bg-yellow-700 !text-white'
                : '!bg-yellow-50 !border-yellow-600 !text-yellow-700 hover:!bg-yellow-100 hover:!text-yellow-800 dark:!bg-yellow-900/30 dark:!border-yellow-800 dark:!text-yellow-300 dark:hover:!bg-yellow-900/50 dark:hover:!text-yellow-200'
            }`}
          >
            Égalité
          </Button>
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-3">
        <Label htmlFor="comment" className="text-base font-medium">
          Commentaire (optionnel)
        </Label>
        <Textarea
          id="comment"
          placeholder="Ajoutez un commentaire sur cette game..."
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const sanitizedValue = sanitizeString(e.target.value);
            onChange(gameStatus, sanitizedValue);
          }}
          className="min-h-[100px] resize-none"
          maxLength={500}
          disabled={loading}
        />
        <p className="text-sm text-muted-foreground">{comment.length}/500 caractères</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={loading}>
          Retour
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter la game'}
        </Button>
      </div>
    </div>
  );
}
