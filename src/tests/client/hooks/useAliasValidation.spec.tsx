import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAliasValidation } from '@/client/hooks/useAliasValidation';
import { isAlteredAliasTaken } from '@/server/features/player/PlayerRepository';

// Mock of useDebounce hook
vi.mock('@/client/hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value),
}));

// Mock of isAlteredAliasTaken
vi.mock('@/server/features/player/PlayerRepository', () => ({
  isAlteredAliasTaken: vi.fn(),
}));

describe('useAliasValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state for empty alias', () => {
    const { result } = renderHook(() => useAliasValidation(''));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: null,
      isAvailable: null,
    });
  });

  it('should return error for short alias', () => {
    const { result } = renderHook(() => useAliasValidation('ab'));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo doit contenir au moins 3 caractères',
      isAvailable: null,
    });
  });

  it('should return error for alias too long', () => {
    const { result } = renderHook(() => useAliasValidation('a'.repeat(21)));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo ne peut pas dépasser 20 caractères',
      isAvailable: false,
    });
  });

  it('should return error for alias with invalid characters', () => {
    const { result } = renderHook(() => useAliasValidation('test@user'));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores',
      isAvailable: false,
    });
  });

  it('should return error for alias starting with dash', () => {
    const { result } = renderHook(() => useAliasValidation('-testuser'));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo ne peut pas commencer ou finir par un tiret',
      isAvailable: false,
    });
  });

  it('should return error for alias ending with dash', () => {
    const { result } = renderHook(() => useAliasValidation('testuser-'));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo ne peut pas commencer ou finir par un tiret',
      isAvailable: false,
    });
  });

  it('should return error for alias starting with underscore', () => {
    const { result } = renderHook(() => useAliasValidation('_testuser'));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo ne peut pas commencer ou finir par un underscore',
      isAvailable: false,
    });
  });

  it('should return error for alias ending with underscore', () => {
    const { result } = renderHook(() => useAliasValidation('testuser_'));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo ne peut pas commencer ou finir par un underscore',
      isAvailable: false,
    });
  });

  it('should return error for alias starting with number', () => {
    const { result } = renderHook(() => useAliasValidation('1testuser'));

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Le pseudo ne peut pas commencer par un chiffre',
      isAvailable: false,
    });
  });

  it('should check availability for valid alias', async () => {
    (isAlteredAliasTaken as ReturnType<typeof vi.fn>).mockResolvedValue({
      type: 'success',
      data: false, // Available
    });

    const { result } = renderHook(() => useAliasValidation('testuser'));

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current).toEqual({
      isValid: true,
      isChecking: false,
      error: null,
      isAvailable: true,
    });

    expect(isAlteredAliasTaken).toHaveBeenCalledWith('testuser');
  });

  it('should return error for taken alias', async () => {
    (isAlteredAliasTaken as ReturnType<typeof vi.fn>).mockResolvedValue({
      type: 'success',
      data: true, // Taken
    });

    const { result } = renderHook(() => useAliasValidation('testuser'));

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Ce pseudo est déjà pris',
      isAvailable: false,
    });
  });

  it('should handle API error', async () => {
    (isAlteredAliasTaken as ReturnType<typeof vi.fn>).mockResolvedValue({
      type: 'failure',
      reason: 'Database error',
    });

    const { result } = renderHook(() => useAliasValidation('testuser'));

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Erreur lors de la vérification du pseudo',
      isAvailable: false,
    });
  });

  it('should handle API exception', async () => {
    (isAlteredAliasTaken as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAliasValidation('testuser'));

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current).toEqual({
      isValid: false,
      isChecking: false,
      error: 'Erreur lors de la vérification du pseudo',
      isAvailable: false,
    });
  });

  it('should accept valid aliases with various characters', () => {
    const validAliases = [
      'testuser',
      'test_user',
      'test-user',
      'TestUser',
      'test123',
      'user_test-123',
    ];

    validAliases.forEach((alias) => {
      const { result } = renderHook(() => useAliasValidation(alias));

      // Should not have validation errors (availability check will be done separately)
      expect(result.current.error).not.toBe(
        'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores',
      );
      expect(result.current.error).not.toBe(
        'Le pseudo ne peut pas commencer ou finir par un tiret',
      );
      expect(result.current.error).not.toBe(
        'Le pseudo ne peut pas commencer ou finir par un underscore',
      );
      expect(result.current.error).not.toBe('Le pseudo ne peut pas commencer par un chiffre');
    });
  });
});
