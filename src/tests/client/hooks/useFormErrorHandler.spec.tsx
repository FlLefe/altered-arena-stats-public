import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFormErrorHandler } from '@/client/hooks/useFormErrorHandler';
import { withErrorHandling } from '@/tests/utils/test-helpers';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useFormErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a handler function', () => {
    const { result } = renderHook(() => useFormErrorHandler());

    expect(result.current).toBeInstanceOf(Function);
  });

  it('should handle Error objects with custom message', async () => {
    await withErrorHandling(async () => {
      const { result } = renderHook(() => useFormErrorHandler());
      const error = new Error('Erreur de validation');

      result.current(error);

      expect(toast.error).toHaveBeenCalledWith('Erreur de validation');
    });
  });

  it('should handle Error objects without message', async () => {
    await withErrorHandling(async () => {
      const { result } = renderHook(() => useFormErrorHandler());
      const error = new Error();

      result.current(error);

      expect(toast.error).toHaveBeenCalledWith('');
    });
  });

  it('should handle non-Error objects with default message', async () => {
    await withErrorHandling(async () => {
      const { result } = renderHook(() => useFormErrorHandler());
      const error = 'Erreur string';

      result.current(error);

      expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue.');
    });
  });

  it('should handle null with default message', async () => {
    await withErrorHandling(async () => {
      const { result } = renderHook(() => useFormErrorHandler());

      result.current(null);

      expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue.');
    });
  });

  it('should handle undefined with default message', async () => {
    await withErrorHandling(async () => {
      const { result } = renderHook(() => useFormErrorHandler());

      result.current(undefined);

      expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue.');
    });
  });

  it('should use custom default message', async () => {
    await withErrorHandling(async () => {
      const customMessage = 'Erreur personnalisée';
      const { result } = renderHook(() => useFormErrorHandler(customMessage));
      const error = 'Erreur string';

      result.current(error);

      expect(toast.error).toHaveBeenCalledWith(customMessage);
    });
  });

  it('should handle complex objects with default message', async () => {
    await withErrorHandling(async () => {
      const { result } = renderHook(() => useFormErrorHandler());
      const error = { code: 500, message: 'Server error' };

      result.current(error);

      expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue.');
    });
  });
});
