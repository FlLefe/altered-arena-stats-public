'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { BaseSeasonDTO } from '@/server/features/season/SeasonDTO';
import { MatchDraftFormData, MatchDraftFormDataPartial } from '@/types';
import { getCurrentSeason } from '@/utils';
import { StepComment } from './addMatchSteps/StepComment';
import { StepEvent } from './addMatchSteps/StepEvent';
import { StepFormat } from './addMatchSteps/StepFormat';
import { StepOpponent } from './addMatchSteps/StepOpponent';
import { StepSeason } from './addMatchSteps/StepSeason';
import { StepSubmit } from './addMatchSteps/StepSubmit';
import { StepType } from './addMatchSteps/StepType';
import { StepperProgress } from './addMatchSteps/StepperProgress';

type Props = {
  seasons: BaseSeasonDTO[];
};

export function AddMatchContainer({ seasons }: Props) {
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSeason = useMemo(() => getCurrentSeason(seasons), [seasons]);

  const [formData, setFormData] = useState<MatchDraftFormDataPartial>({
    matchFormat: 'BO1',
    seasonId: currentSeason?.id || '',
    eventId: '',
    opponentName: '',
    comment: '',
  });

  // Update seasonId if currentSeason changes
  useEffect(() => {
    if (currentSeason?.id && !formData.seasonId) {
      setFormData((prev) => ({ ...prev, seasonId: currentSeason.id }));
    }
  }, [currentSeason, formData.seasonId]);

  const goNext = useCallback(() => setStep((step) => Math.min(step + 1, 3)), []);
  const goBack = useCallback(() => setStep((step) => Math.max(step - 1, 1)), []);

  const update = useCallback((fields: Partial<MatchDraftFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step]);

  const showNavigation = step > 1 && step < 3;

  // Vérifier si on peut passer à l'étape suivante
  const canGoNext = useCallback(() => {
    if (step === 1) {
      return !!formData.matchType;
    }
    if (step === 2) {
      return !!formData.matchFormat && !!formData.seasonId;
    }
    return true;
  }, [step, formData.matchType, formData.matchFormat, formData.seasonId]);

  // Vérifier s'il y a des saisons disponibles
  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Aucune saison n&apos;est disponible. Veuillez contacter un administrateur.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6 pb-32">
      <StepperProgress step={step} total={3} />

      {/* Étape 1: Type de match */}
      {step === 1 && (
        <StepType
          matchType={formData.matchType}
          onChange={(value) =>
            update({
              matchType: value,
              eventId: value === 'FRIENDLY' ? '' : formData.eventId,
            })
          }
          onNext={goNext}
        />
      )}

      {/* Étape 2: Format et Saison */}
      {step === 2 && (
        <div className="space-y-8">
          <StepFormat
            format={formData.matchFormat || 'BO1'}
            onChange={(format) => update({ matchFormat: format })}
          />

          <StepSeason
            seasonId={formData.seasonId || ''}
            seasons={seasons}
            onChange={(seasonId) => update({ seasonId })}
          />
        </div>
      )}

      {/* Étape 3: Événement, Adversaire, Commentaire et Soumission */}
      {step === 3 && formData.matchType && (
        <div className="space-y-8">
          {formData.matchType === 'TOURNAMENT' && (
            <StepEvent
              eventId={formData.eventId || ''}
              onChange={(eventId) => update({ eventId })}
            />
          )}

          <StepOpponent
            opponentName={formData.opponentName || ''}
            onChange={(opponentName) => update({ opponentName })}
          />

          <StepComment
            comment={formData.comment || ''}
            onChange={(comment) => update({ comment })}
          />

          <StepSubmit formData={formData as MatchDraftFormData} onBack={goBack} />
        </div>
      )}

      {/* Navigation entre étapes */}
      {showNavigation && step < 3 && (
        <div className="flex pt-6 gap-4">
          <Button variant="secondary" onClick={goBack} className="flex-1 min-w-0">
            Retour
          </Button>
          <Button onClick={goNext} disabled={!canGoNext()} className="flex-1 min-w-0">
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
