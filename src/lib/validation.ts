import { z } from 'zod';
import { ValidationError, createError } from './errors';

// Utility function to validate with Zod and return an ApplicationError
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const errorMessage = firstIssue.message || 'Données invalides';

    throw new ValidationError(errorMessage, {
      field: firstIssue.path.join('.'),
      code: firstIssue.code,
      context,
    });
  }

  return result.data;
}

// Function to validate and return a Result
export function validateWithZodResult<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string,
): { success: true; data: T } | { success: false; error: string; code: string } {
  try {
    const validatedData = validateWithZod(schema, data, context);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, code: error.code };
    }

    // If it's not a ValidationError, try to parse the Zod error directly
    try {
      const result = schema.safeParse(data);
      if (!result.success) {
        const firstIssue = result.error.issues[0];
        const fieldPath = firstIssue.path.join('.');
        const errorMessage = firstIssue.message || 'Données invalides';
        const detailedMessage = fieldPath ? `${fieldPath}: ${errorMessage}` : errorMessage;

        return { success: false, error: detailedMessage, code: 'VALIDATION_ERROR' };
      }
    } catch {
      // If even safeParse throws an error, return a generic error
      return { success: false, error: 'Erreur de validation', code: 'VALIDATION_ERROR' };
    }

    return { success: false, error: 'Erreur de validation', code: 'VALIDATION_ERROR' };
  }
}

// Function to create custom error messages
export function createValidationMessage(field: string, message: string): string {
  return `${field}: ${message}`;
}

// Function to validate authentication
export function validateAuthentication(session: unknown): void {
  if (!session || (session as { type?: string }).type !== 'success') {
    throw createError.unauthorized('Utilisateur non authentifié');
  }
}

// Function to validate admin access
export function validateAdminAccess(session: unknown): void {
  validateAuthentication(session);

  if ((session as { data: { role: string } }).data.role !== 'admin') {
    throw createError.forbidden('Accès administrateur requis');
  }
}

// Function to validate the existence of a resource
export function validateResourceExists<T>(resource: T | null, resourceName: string): T {
  if (!resource) {
    throw createError.notFound(resourceName);
  }
  return resource;
}

// Function to validate business rules
export function validateBusinessRule(condition: boolean, message: string): void {
  if (!condition) {
    throw createError.businessRule(message);
  }
}
