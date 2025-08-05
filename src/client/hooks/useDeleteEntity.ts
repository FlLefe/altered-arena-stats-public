'use client';

import { useTransition } from 'react';
import { useErrorHandler } from './useErrorHandler';

type DeleteAction = (params: {
  id: string;
}) => Promise<{ success: boolean; error?: string; code?: string }>;

type UseDeleteEntityOptions = {
  onError?: (msg: string) => void;
  onSuccessMessage?: string;
  onErrorMessage?: string;
};

export function useDeleteEntity(deleteAction: DeleteAction, options?: UseDeleteEntityOptions) {
  const [isPending, startTransition] = useTransition();
  const { handleError, handleSuccess } = useErrorHandler();

  const handleDelete = (id: string, onSuccess?: () => void) => {
    startTransition(async () => {
      try {
        const result = await deleteAction({ id });

        if (!result.success) {
          const errorResponse = {
            success: false as const,
            error: result.error ?? options?.onErrorMessage ?? 'Une erreur est survenue.',
            code: result.code || 'UNKNOWN_ERROR',
          };
          handleError(errorResponse);
          options?.onError?.(errorResponse.error);
          return;
        }

        if (options?.onSuccessMessage) {
          handleSuccess(options.onSuccessMessage);
        }

        onSuccess?.();
      } catch {
        const errorMessage = "Une erreur inattendue s'est produite";
        handleError(errorMessage);
        options?.onError?.(errorMessage);
      }
    });
  };

  return { handleDelete, isPending };
}
