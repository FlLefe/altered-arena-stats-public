'use client';

import { useState, useEffect } from 'react';
import { checkAliasAvailabilityAction } from '@/server/features/player/checkAliasAvailabilityAction';
import { useDebounce } from './useDebounce';

export type AliasValidationState = {
  isValid: boolean;
  isChecking: boolean;
  error: string | null;
  isAvailable: boolean | null;
};

export function useAliasValidation(alias: string) {
  const [state, setState] = useState<AliasValidationState>({
    isValid: false,
    isChecking: false,
    error: null,
    isAvailable: null,
  });

  const debouncedAlias = useDebounce(alias, 500);

  useEffect(() => {
    if (!debouncedAlias || debouncedAlias.length < 3) {
      setState({
        isValid: false,
        isChecking: false,
        error:
          debouncedAlias.length > 0 && debouncedAlias.length < 3
            ? 'Le pseudo doit contenir au moins 3 caractères'
            : null,
        isAvailable: null,
      });
      return;
    }

    // Base validation rules
    const validationRules = [
      {
        test: (val: string) => val.length <= 20,
        error: 'Le pseudo ne peut pas dépasser 20 caractères',
      },
      {
        test: (val: string) => /^[a-zA-Z0-9_-]+$/.test(val),
        error: 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores',
      },
      {
        test: (val: string) => !val.startsWith('-') && !val.endsWith('-'),
        error: 'Le pseudo ne peut pas commencer ou finir par un tiret',
      },
      {
        test: (val: string) => !val.startsWith('_') && !val.endsWith('_'),
        error: 'Le pseudo ne peut pas commencer ou finir par un underscore',
      },
      {
        test: (val: string) => !/^[0-9]/.test(val),
        error: 'Le pseudo ne peut pas commencer par un chiffre',
      },
    ];

    const failedRule = validationRules.find((rule) => !rule.test(debouncedAlias));
    if (failedRule) {
      setState({
        isValid: false,
        isChecking: false,
        error: failedRule.error,
        isAvailable: false,
      });
      return;
    }

    // Availability check via Server Action
    setState((prev) => ({ ...prev, isChecking: true, error: null }));

    checkAliasAvailabilityAction(debouncedAlias)
      .then((result) => {
        if (!result.success) {
          setState({
            isValid: false,
            isChecking: false,
            error: result.error || 'Erreur lors de la vérification du pseudo',
            isAvailable: false,
          });
        } else {
          const isAvailable = result.isAvailable ?? false;
          setState({
            isValid: isAvailable,
            isChecking: false,
            error: isAvailable ? null : 'Ce pseudo est déjà pris',
            isAvailable,
          });
        }
      })
      .catch(() => {
        setState({
          isValid: false,
          isChecking: false,
          error: 'Erreur lors de la vérification du pseudo',
          isAvailable: false,
        });
      });
  }, [debouncedAlias]);

  return state;
}
