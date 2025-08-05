import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useErrorHandler, isServerError, extractData } from '@/client/hooks/useErrorHandler';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleError', () => {
    it('should handle string error', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError('Erreur simple');

      expect(toast.error).toHaveBeenCalledWith('Erreur simple');
      expect(toast.warning).not.toHaveBeenCalled();
    });

    it('should handle Error object', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError(new Error('Erreur technique'));

      expect(toast.error).toHaveBeenCalledWith('Erreur technique');
    });

    it('should handle Error object without message', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError(new Error());

      expect(toast.error).toHaveBeenCalledWith("Une erreur inattendue s'est produite");
    });

    it('should handle VALIDATION_ERROR as warning', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Données invalides',
        code: 'VALIDATION_ERROR',
      });

      expect(toast.warning).toHaveBeenCalledWith('Données invalides');
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle INVALID_INPUT as warning', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Entrée invalide',
        code: 'INVALID_INPUT',
      });

      expect(toast.warning).toHaveBeenCalledWith('Entrée invalide');
    });

    it('should handle MAX_MATCHES_REACHED as warning', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Limite atteinte',
        code: 'MAX_MATCHES_REACHED',
      });

      expect(toast.warning).toHaveBeenCalledWith('Limite atteinte');
    });

    it('should handle ALIAS_ALREADY_TAKEN as warning', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Alias déjà pris',
        code: 'ALIAS_ALREADY_TAKEN',
      });

      expect(toast.warning).toHaveBeenCalledWith('Alias déjà pris');
    });

    it('should handle UNAUTHORIZED with custom message', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Non autorisé',
        code: 'UNAUTHORIZED',
      });

      expect(toast.error).toHaveBeenCalledWith('Veuillez vous connecter pour continuer');
    });

    it('should handle FORBIDDEN with custom message', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Accès interdit',
        code: 'FORBIDDEN',
      });

      expect(toast.error).toHaveBeenCalledWith("Vous n'avez pas les permissions nécessaires");
    });

    it('should handle RESOURCE_NOT_FOUND with custom message', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Ressource introuvable',
        code: 'RESOURCE_NOT_FOUND',
      });

      expect(toast.error).toHaveBeenCalledWith("La ressource demandée n'existe pas");
    });

    it('should handle INTERNAL_ERROR with custom message', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Erreur interne',
        code: 'INTERNAL_ERROR',
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Une erreur technique s'est produite. Veuillez réessayer.",
      );
    });

    it('should handle DATABASE_ERROR with custom message', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Erreur base de données',
        code: 'DATABASE_ERROR',
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Une erreur technique s'est produite. Veuillez réessayer.",
      );
    });

    it('should handle unknown error code with default message', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleError({
        success: false,
        error: 'Erreur inconnue',
        code: 'UNKNOWN_CODE',
      });

      expect(toast.error).toHaveBeenCalledWith('Erreur inconnue');
    });
  });

  describe('handleSuccess', () => {
    it('should show success toast', () => {
      const { result } = renderHook(() => useErrorHandler());

      result.current.handleSuccess('Opération réussie');

      expect(toast.success).toHaveBeenCalledWith('Opération réussie');
    });
  });
});

describe('isServerError', () => {
  it('should return true for error response', () => {
    const errorResponse = {
      success: false as const,
      error: 'Erreur test',
    };

    expect(isServerError(errorResponse)).toBe(true);
  });

  it('should return false for success response', () => {
    const successResponse = {
      success: true as const,
      data: { id: '1', name: 'Test' },
    };

    expect(isServerError(successResponse)).toBe(false);
  });
});

describe('extractData', () => {
  it('should extract data from success response', () => {
    const data = { id: '1', name: 'Test' };
    const successResponse = {
      success: true as const,
      data,
    };

    expect(extractData(successResponse)).toEqual(data);
  });

  it('should return null for error response', () => {
    const errorResponse = {
      success: false as const,
      error: 'Erreur test',
    };

    expect(extractData(errorResponse)).toBeNull();
  });
});
