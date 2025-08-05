'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StepperProgress } from '@/client/features/match/addMatchSteps/StepperProgress';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { createGameAction } from '@/server/features/game/createGameAction';
import { MatchWithGames, GameFormData, GameFormDataPartial } from '@/types';
import { getCurrentGameNumber, getMaxGamesForFormat, checkIfMatchFinished } from '@/utils/match';
import { StepHeroes } from './addGameSteps/StepHeroes';
import { StepResult } from './addGameSteps/StepResult';

type Props = {
  match: MatchWithGames;
  gameFormData: {
    factions: Array<{
      id: string;
      name: string;
      colorCode: string;
    }>;
    heroes: Array<{
      id: string;
      name: string;
      imageUrl: string | null;
      faction: {
        id: string;
        name: string;
        colorCode: string;
      };
    }>;
  } | null;
  preselectedHeroes?: {
    playerHeroId: string;
    opponentHeroId: string;
  } | null;
};

export function AddGameContainer({ match, gameFormData, preselectedHeroes }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { handleError, handleSuccess } = useErrorHandler();

  const [formData, setFormData] = useState<GameFormDataPartial>({
    playerHeroId: preselectedHeroes?.playerHeroId || '',
    opponentHeroId: preselectedHeroes?.opponentHeroId || '',
    gameStatus: 'WIN',
    comment: '',
  });

  const goNext = useCallback(() => setStep((step) => Math.min(step + 1, 2)), []);
  const goBack = useCallback(() => setStep((step) => Math.max(step - 1, 1)), []);

  const update = useCallback((fields: Partial<GameFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step]);

  // If heroes are pre-selected, go directly to step 2
  useEffect(() => {
    if (preselectedHeroes?.playerHeroId && preselectedHeroes?.opponentHeroId) {
      setStep(2);
    }
  }, [preselectedHeroes]);

  const handleSubmit = async () => {
    if (!formData.playerHeroId || !formData.opponentHeroId || !formData.gameStatus) {
      handleError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const result = await createGameAction({
        data: {
          matchId: match.id,
          playerHeroId: formData.playerHeroId,
          opponentHeroId: formData.opponentHeroId,
          gameStatus: formData.gameStatus,
          comment: formData.comment || undefined,
        },
      });

      if (!result.success) {
        handleError(result.error || "Une erreur s'est produite");
        return;
      }

      handleSuccess('Game ajoutée avec succès');

      // Calculate new statistics after adding the game
      const newGames = [
        ...match.games,
        {
          id: 'temp-id', // Temporary ID for calculation
          gameStatus: formData.gameStatus as 'WIN' | 'LOSS' | 'DRAW',
          playerHeroId: formData.playerHeroId,
          opponentHeroId: formData.opponentHeroId,
          comment: formData.comment || null,
          matchId: match.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          playerHero: null, // Not necessary for calculation
          opponentHero: null, // Not necessary for calculation
        },
      ];

      const wins = newGames.filter((g) => g.gameStatus === 'WIN').length;
      const losses = newGames.filter((g) => g.gameStatus === 'LOSS').length;

      // Check if the match is now finished
      const isMatchFinished = checkIfMatchFinished(
        match.matchFormat,
        newGames.length,
        wins,
        losses,
      );

      if (isMatchFinished) {
        // The match is finished, redirect to the match page
        router.push(`/dashboard/match/${match.id}`);
      } else if (match.matchFormat !== 'BO1' && match.matchType === 'TOURNAMENT') {
        // The match is not finished, it's not a BO1 and it's a TOURNAMENT, propose to add the next game
        const heroData = encodeURIComponent(
          JSON.stringify({
            playerHeroId: formData.playerHeroId,
            opponentHeroId: formData.opponentHeroId,
          }),
        );
        router.push(`/dashboard/match/${match.id}/add-game?heroes=${heroData}`);
      } else {
        // BO1 finished or friendly match, redirect to the match page
        router.push(`/dashboard/match/${match.id}`);
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : "Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const currentGameNumber = getCurrentGameNumber(match.games.length);
  const maxGames = getMaxGamesForFormat(match.matchFormat);

  return (
    <div ref={containerRef} className="space-y-6 pb-32">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Game {currentGameNumber} sur {maxGames}
        </h2>
      </div>

      <StepperProgress step={step} total={2} />

      {/* Step 1: Hero selection (skipped if heroes are pre-selected) */}
      {step === 1 && (
        <StepHeroes
          playerHeroId={formData.playerHeroId || ''}
          opponentHeroId={formData.opponentHeroId || ''}
          onChange={(playerHeroId, opponentHeroId) => update({ playerHeroId, opponentHeroId })}
          onNext={goNext}
          gameFormData={gameFormData}
        />
      )}

      {/* Step 2: Result and comment */}
      {step === 2 && (
        <StepResult
          gameStatus={formData.gameStatus || 'WIN'}
          comment={formData.comment || ''}
          onChange={(gameStatus, comment) => update({ gameStatus, comment })}
          onSubmit={handleSubmit}
          onBack={goBack}
          loading={loading}
        />
      )}
    </div>
  );
}
