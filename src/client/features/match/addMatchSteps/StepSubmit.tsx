'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { Button } from '@/components/ui/button';
import { createMatchDraftAction } from '@/server/features/match/createMatchDraftAction';
import { MatchDraftFormData } from '@/types';

type Props = {
  formData: MatchDraftFormData;
  onBack?: () => void;
};

export function StepSubmit({ formData, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { handleError, handleSuccess } = useErrorHandler();

  const handleSubmit = async () => {
    // Frontend validation
    if (!formData.matchType) {
      handleError('Veuillez sélectionner un type de match');
      return;
    }

    if (!formData.matchFormat) {
      handleError('Veuillez sélectionner un format de match');
      return;
    }

    if (!formData.seasonId) {
      handleError('Veuillez sélectionner une saison');
      return;
    }

    if (!formData.opponentName?.trim()) {
      handleError("Veuillez saisir le nom de l'adversaire");
      return;
    }

    setLoading(true);

    try {
      const result = await createMatchDraftAction({ data: formData });

      if (!result.success) {
        handleError(result.error || "Une erreur s'est produite");
        return;
      }

      handleSuccess('Match créé avec succès');

      // If it's a BO3/BO5 + Tournament, redirect to hero selection
      if (formData.matchFormat !== 'BO1' && formData.matchType === 'TOURNAMENT') {
        const matchData = encodeURIComponent(
          JSON.stringify({
            matchId: result.data,
            matchFormat: formData.matchFormat,
            opponentName: formData.opponentName,
          }),
        );
        router.push(`/dashboard/match/create-with-heroes?data=${matchData}`);
      } else {
        // Normal behavior for BO1 or Friendly
        router.push(`/dashboard/match/${result.data}/add-game`);
      }
    } catch {
      handleError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 pt-4">
      <Button variant="secondary" onClick={onBack} className="flex-1 min-w-0">
        Retour
      </Button>
      <Button onClick={handleSubmit} disabled={loading} className="flex-1 min-w-0">
        {loading ? 'Création...' : 'Créer le match'}
      </Button>
    </div>
  );
}
