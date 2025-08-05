import { toast } from 'sonner';

// Types for server error responses
export interface ServerErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export interface ServerSuccessResponse<T> {
  success: true;
  data: T;
}

export type ServerResponse<T> = ServerSuccessResponse<T> | ServerErrorResponse;

// Hook to handle client-side errors
export function useErrorHandler() {
  const handleError = (error: ServerErrorResponse | Error | string) => {
    let message: string;
    let isWarning = false;

    if (typeof error === 'string') {
      message = error;
    } else if ('error' in error) {
      // ServerErrorResponse
      message = error.error;

      // Customization based on error code
      switch (error.code) {
        case 'VALIDATION_ERROR':
        case 'INVALID_INPUT':
        case 'MAX_MATCHES_REACHED':
        case 'ALIAS_ALREADY_TAKEN':
          isWarning = true;
          break;
        case 'UNAUTHORIZED':
          message = 'Veuillez vous connecter pour continuer';
          break;
        case 'FORBIDDEN':
          message = "Vous n'avez pas les permissions nécessaires";
          break;
        case 'RESOURCE_NOT_FOUND':
          message = "La ressource demandée n'existe pas";
          break;
        case 'INTERNAL_ERROR':
        case 'DATABASE_ERROR':
          message = "Une erreur technique s'est produite. Veuillez réessayer.";
          break;
        default:
          // Default message
          break;
      }
    } else {
      // Standard error
      message = error.message || "Une erreur inattendue s'est produite";
    }

    // Display toast with the appropriate type
    if (isWarning) {
      toast.warning(message);
    } else {
      toast.error(message);
    }
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return {
    handleError,
    handleSuccess,
  };
}

// Utility function to check if a response is an error
export function isServerError<T>(response: ServerResponse<T>): response is ServerErrorResponse {
  return !response.success;
}

// Utility function to extract data from a response
export function extractData<T>(response: ServerResponse<T>): T | null {
  return response.success ? response.data : null;
}
