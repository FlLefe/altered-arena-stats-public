import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteEntity } from '@/client/hooks/useDeleteEntity';
import * as useErrorHandlerModule from '@/client/hooks/useErrorHandler';

vi.mock('@/client/hooks/useErrorHandler', () => ({
  useErrorHandler: vi.fn(),
}));

describe('useDeleteEntity', () => {
  const mockHandleError = vi.fn();
  const mockHandleSuccess = vi.fn();
  const mockDeleteAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useErrorHandlerModule.useErrorHandler).mockReturnValue({
      handleError: mockHandleError,
      handleSuccess: mockHandleSuccess,
    });
  });

  it('should return handleDelete function and isPending state', () => {
    const { result } = renderHook(() => useDeleteEntity(mockDeleteAction));

    expect(result.current.handleDelete).toBeInstanceOf(Function);
    expect(result.current.isPending).toBe(false);
  });

  it('should handle successful deletion', async () => {
    mockDeleteAction.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useDeleteEntity(mockDeleteAction, {
        onSuccessMessage: 'Suppression réussie',
      }),
    );

    const onSuccessCallback = vi.fn();

    await act(async () => {
      result.current.handleDelete('123', onSuccessCallback);
    });

    expect(mockDeleteAction).toHaveBeenCalledWith({ id: '123' });
    expect(mockHandleSuccess).toHaveBeenCalledWith('Suppression réussie');
    expect(onSuccessCallback).toHaveBeenCalled();
    expect(mockHandleError).not.toHaveBeenCalled();
  });

  it('should handle deletion error with custom error message', async () => {
    mockDeleteAction.mockResolvedValue({
      success: false,
      error: 'Erreur de suppression',
    });

    const onErrorCallback = vi.fn();
    const { result } = renderHook(() =>
      useDeleteEntity(mockDeleteAction, {
        onErrorMessage: 'Erreur personnalisée',
        onError: onErrorCallback,
      }),
    );

    await act(async () => {
      result.current.handleDelete('123');
    });

    expect(mockDeleteAction).toHaveBeenCalledWith({ id: '123' });
    expect(mockHandleError).toHaveBeenCalledWith({
      success: false,
      error: 'Erreur de suppression',
      code: 'UNKNOWN_ERROR',
    });
    expect(onErrorCallback).toHaveBeenCalledWith('Erreur de suppression');
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should use onErrorMessage when result.error is not provided', async () => {
    mockDeleteAction.mockResolvedValue({
      success: false,
    });

    const onErrorCallback = vi.fn();
    const { result } = renderHook(() =>
      useDeleteEntity(mockDeleteAction, {
        onErrorMessage: 'Erreur personnalisée',
        onError: onErrorCallback,
      }),
    );

    await act(async () => {
      result.current.handleDelete('123');
    });

    expect(mockDeleteAction).toHaveBeenCalledWith({ id: '123' });
    expect(mockHandleError).toHaveBeenCalledWith({
      success: false,
      error: 'Erreur personnalisée',
      code: 'UNKNOWN_ERROR',
    });
    expect(onErrorCallback).toHaveBeenCalledWith('Erreur personnalisée');
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should handle deletion error without custom error message', async () => {
    mockDeleteAction.mockResolvedValue({
      success: false,
      error: 'Erreur de suppression',
      code: 'VALIDATION_ERROR',
    });

    const { result } = renderHook(() => useDeleteEntity(mockDeleteAction));

    await act(async () => {
      result.current.handleDelete('123');
    });

    expect(mockHandleError).toHaveBeenCalledWith({
      success: false,
      error: 'Erreur de suppression',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should handle deletion error with default error message', async () => {
    mockDeleteAction.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useDeleteEntity(mockDeleteAction));

    await act(async () => {
      result.current.handleDelete('123');
    });

    expect(mockHandleError).toHaveBeenCalledWith({
      success: false,
      error: 'Une erreur est survenue.',
      code: 'UNKNOWN_ERROR',
    });
  });

  it('should handle unexpected error during deletion', async () => {
    mockDeleteAction.mockRejectedValue(new Error('Network error'));

    const onErrorCallback = vi.fn();
    const { result } = renderHook(() =>
      useDeleteEntity(mockDeleteAction, { onError: onErrorCallback }),
    );

    await act(async () => {
      result.current.handleDelete('123');
    });

    expect(mockHandleError).toHaveBeenCalledWith("Une erreur inattendue s'est produite");
    expect(onErrorCallback).toHaveBeenCalledWith("Une erreur inattendue s'est produite");
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should not call onSuccess callback when deletion fails', async () => {
    mockDeleteAction.mockResolvedValue({ success: false });

    const onSuccessCallback = vi.fn();
    const { result } = renderHook(() => useDeleteEntity(mockDeleteAction));

    await act(async () => {
      result.current.handleDelete('123', onSuccessCallback);
    });

    expect(onSuccessCallback).not.toHaveBeenCalled();
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should handle successful deletion without success message', async () => {
    mockDeleteAction.mockResolvedValue({ success: true });

    const onSuccessCallback = vi.fn();
    const { result } = renderHook(() => useDeleteEntity(mockDeleteAction));

    await act(async () => {
      result.current.handleDelete('123', onSuccessCallback);
    });

    expect(mockDeleteAction).toHaveBeenCalledWith({ id: '123' });
    expect(mockHandleSuccess).not.toHaveBeenCalled();
    expect(onSuccessCallback).toHaveBeenCalled();
  });
});
