'use client';

import { useState, useEffect } from 'react';
import { COMMON_PASSWORDS } from '@/constants';

export type PasswordValidationState = {
  isValid: boolean;
  error: string | null;
  isMatching: boolean | null;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    noCommon: boolean;
  };
};

export function usePasswordValidation(password: string, confirmPassword: string) {
  const [state, setState] = useState<PasswordValidationState>({
    isValid: false,
    error: null,
    isMatching: null,
    strength: 'weak',
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
      noCommon: false,
    },
  });

  useEffect(() => {
    // Password validation
    if (!password) {
      setState({
        isValid: false,
        error: null,
        isMatching: null,
        strength: 'weak',
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
          noCommon: false,
        },
      });
      return;
    }

    // Individual checks
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
      noCommon: !COMMON_PASSWORDS.includes(password.toLowerCase()),
    };

    // Password strength calculation
    let strengthScore = 0;
    if (checks.length) strengthScore += 2;
    if (checks.uppercase) strengthScore += 1;
    if (checks.lowercase) strengthScore += 1;
    if (checks.number) strengthScore += 1;
    if (checks.special) strengthScore += 2;
    if (checks.noCommon) strengthScore += 2;
    if (password.length >= 12) strengthScore += 1;
    if (password.length >= 16) strengthScore += 1;

    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (strengthScore < 4) strength = 'weak';
    else if (strengthScore < 6) strength = 'medium';
    else if (strengthScore < 8) strength = 'strong';
    else strength = 'very-strong';

    // Check if the passwords match if confirmPassword is provided
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setState({
          isValid: false,
          error: 'Les mots de passe ne correspondent pas',
          isMatching: false,
          strength,
          checks,
        });
        return;
      } else {
        // All checks must pass for a valid password
        const allChecksPass = Object.values(checks).every((check) => check);
        setState({
          isValid: allChecksPass,
          error: allChecksPass
            ? null
            : 'Le mot de passe ne respecte pas toutes les exigences de sécurité',
          isMatching: true,
          strength,
          checks,
        });
        return;
      }
    }

    // Password in progress (not yet confirmed)
    const allChecksPass = Object.values(checks).every((check) => check);
    setState({
      isValid: allChecksPass,
      error: allChecksPass
        ? null
        : 'Le mot de passe ne respecte pas toutes les exigences de sécurité',
      isMatching: null,
      strength,
      checks,
    });
  }, [password, confirmPassword]);

  return state;
}
