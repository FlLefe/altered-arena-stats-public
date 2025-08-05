import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePasswordValidation } from '@/client/hooks/usePasswordValidation';

describe('usePasswordValidation', () => {
  it('should return initial state for empty password', () => {
    const { result } = renderHook(() => usePasswordValidation('', ''));

    expect(result.current).toEqual({
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
  });

  it('should return error for short password', () => {
    const { result } = renderHook(() => usePasswordValidation('123', ''));

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe(
      'Le mot de passe ne respecte pas toutes les exigences de sécurité',
    );
    expect(result.current.checks.length).toBe(false);
  });

  it('should validate strong password correctly', () => {
    const strongPassword = 'SecurePass1';
    const { result } = renderHook(() => usePasswordValidation(strongPassword, ''));

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe(
      'Le mot de passe ne respecte pas toutes les exigences de sécurité',
    );
    expect(result.current.checks).toEqual({
      length: true,
      uppercase: true,
      lowercase: true,
      number: true,
      special: false,
      noCommon: true,
    });
    expect(result.current.strength).toBe('strong');
  });

  it('should detect common passwords', () => {
    const { result } = renderHook(() => usePasswordValidation('password123', ''));

    expect(result.current.isValid).toBe(false);
    expect(result.current.checks.noCommon).toBe(false);
  });

  it('should return error for non-matching passwords', () => {
    const { result } = renderHook(() =>
      usePasswordValidation('SecurePass123!', 'DifferentPass456!'),
    );

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe('Les mots de passe ne correspondent pas');
    expect(result.current.isMatching).toBe(false);
  });

  it('should return valid for matching strong passwords', () => {
    const strongPassword = 'SecurePass123!';
    const { result } = renderHook(() => usePasswordValidation(strongPassword, strongPassword));

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.isMatching).toBe(true);
  });

  it('should handle password with exactly 8 characters', () => {
    const password = 'Secure1!';
    const { result } = renderHook(() => usePasswordValidation(password, password));

    expect(result.current.isValid).toBe(true);
    expect(result.current.checks.length).toBe(true);
  });

  it('should handle very strong password', () => {
    const veryStrongPassword = 'VerySecurePassword123!@#';
    const { result } = renderHook(() =>
      usePasswordValidation(veryStrongPassword, veryStrongPassword),
    );

    expect(result.current.isValid).toBe(true);
    expect(result.current.strength).toBe('very-strong');
  });

  it('should handle password missing uppercase', () => {
    const password = 'securepass123!';
    const { result } = renderHook(() => usePasswordValidation(password, password));

    expect(result.current.isValid).toBe(false);
    expect(result.current.checks.uppercase).toBe(false);
  });

  it('should handle password missing lowercase', () => {
    const password = 'SECUREPASS123!';
    const { result } = renderHook(() => usePasswordValidation(password, password));

    expect(result.current.isValid).toBe(false);
    expect(result.current.checks.lowercase).toBe(false);
  });

  it('should handle password missing number', () => {
    const password = 'SecurePass!';
    const { result } = renderHook(() => usePasswordValidation(password, password));

    expect(result.current.isValid).toBe(false);
    expect(result.current.checks.number).toBe(false);
  });

  it('should handle password missing special character', () => {
    const password = 'SecurePass123';
    const { result } = renderHook(() => usePasswordValidation(password, password));

    expect(result.current.isValid).toBe(false);
    expect(result.current.checks.special).toBe(false);
  });

  it('should handle empty confirmation password', () => {
    const password = 'SecurePass123!';
    const { result } = renderHook(() => usePasswordValidation(password, ''));

    expect(result.current.isValid).toBe(true);
    expect(result.current.isMatching).toBe(null);
  });

  it('should handle case sensitivity in password matching', () => {
    const { result } = renderHook(() => usePasswordValidation('SecurePass123!', 'securepass123!'));

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe('Les mots de passe ne correspondent pas');
    expect(result.current.isMatching).toBe(false);
  });
});
