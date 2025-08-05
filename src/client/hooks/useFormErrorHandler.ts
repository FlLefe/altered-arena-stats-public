'use client';

import { toast } from 'sonner';

export function useFormErrorHandler(defaultMessage = 'Une erreur est survenue.') {
  const handle = (error: unknown) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    toast.error(message);
    console.error('[FormError]', message);
  };

  return handle;
}
