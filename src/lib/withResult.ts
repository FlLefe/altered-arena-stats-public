import { logError, toClientError, DatabaseError } from './errors';
import { Result, ResultFailure, ResultSuccess } from './result';

export async function withResult<T>(
  fn: () => Promise<T>,
  failureMessage = 'Une erreur est survenue',
  context?: string,
): Promise<Result<T>> {
  try {
    const data = await fn();
    return ResultSuccess(data);
  } catch (error) {
    // If it's already an ApplicationError, log it and return it
    if (error instanceof DatabaseError) {
      logError(error, context);
      return ResultFailure(error.message);
    }

    // For other errors, log them and return a generic message
    logError(error as Error, context);
    return ResultFailure(failureMessage);
  }
}

// Specialized version for database operations
export async function withDatabaseResult<T>(
  fn: () => Promise<T>,
  context?: string,
): Promise<Result<T>> {
  try {
    const data = await fn();
    return ResultSuccess(data);
  } catch (error) {
    const dbError = new DatabaseError("Erreur lors de l'opération en base de données", {
      originalError: error instanceof Error ? error.message : String(error),
    });
    logError(dbError, context);
    return ResultFailure(dbError.message);
  }
}

// Version for operations with validation
export async function withValidationResult<T>(
  fn: () => Promise<T>,
  validationError: string,
  context?: string,
): Promise<Result<T>> {
  try {
    const data = await fn();
    return ResultSuccess(data);
  } catch (error) {
    logError(error as Error, context);
    return ResultFailure(validationError);
  }
}

// Wrapper for Server Actions with improved error handling
export async function withServerActionResult<T>(
  fn: () => Promise<T>,
  context?: string,
): Promise<{ success: true; data: T } | { success: false; error: string; code?: string }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    logError(error as Error, context);
    return toClientError(error as Error);
  }
}
