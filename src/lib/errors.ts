// Application-specific error types
export type ErrorCode =
  // Authentication errors
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INVALID_CREDENTIALS'
  | 'SESSION_EXPIRED'

  // Validation errors
  | 'VALIDATION_ERROR'
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED_FIELD'

  // Resource errors
  | 'RESOURCE_NOT_FOUND'
  | 'RESOURCE_ALREADY_EXISTS'
  | 'RESOURCE_CONFLICT'

  // Business errors
  | 'MAX_MATCHES_REACHED'
  | 'MATCH_ALREADY_COMPLETED'
  | 'INVALID_MATCH_STATE'
  | 'ALIAS_ALREADY_TAKEN'

  // Database errors
  | 'DATABASE_ERROR'
  | 'CONSTRAINT_VIOLATION'
  | 'CONNECTION_ERROR'

  // External errors
  | 'EXTERNAL_SERVICE_ERROR'
  | 'SUPABASE_ERROR'

  // Generic errors
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_ERROR';

// Base interface for all errors
export interface AppError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Main error class
export class ApplicationError extends Error implements AppError {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 400,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date();
  }

  // Method to convert to JSON object
  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

// Domain-specific errors
export class AuthenticationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('UNAUTHORIZED', message, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('FORBIDDEN', message, 403, details);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, details?: Record<string, unknown>) {
    super('RESOURCE_NOT_FOUND', `${resource} not found`, 404, details);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('RESOURCE_CONFLICT', message, 409, details);
    this.name = 'ConflictError';
  }
}

export class BusinessRuleError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('INVALID_MATCH_STATE', message, 400, details);
    this.name = 'BusinessRuleError';
  }
}

export class DatabaseError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('DATABASE_ERROR', message, 500, details);
    this.name = 'DatabaseError';
  }
}

// Factory functions to create common errors
export const createError = {
  unauthorized: (message = 'Non authentifié') => new AuthenticationError(message),

  forbidden: (message = 'Accès refusé') => new AuthorizationError(message),

  validation: (message: string, details?: Record<string, unknown>) =>
    new ValidationError(message, details),

  notFound: (resource: string) => new NotFoundError(resource),

  conflict: (message: string) => new ConflictError(message),

  businessRule: (message: string) => new BusinessRuleError(message),

  database: (message = 'Erreur de base de données') => new DatabaseError(message),

  internal: (message = 'Erreur interne du serveur') =>
    new ApplicationError('INTERNAL_ERROR', message, 500),
};

// Utility function to log errors
export function logError(error: Error | ApplicationError, context?: string): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof ApplicationError) {
    console.error('[AppError]', {
      ...errorInfo,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    });
  } else {
    console.error('[Error]', errorInfo);
  }
}

// Function to convert an error to a client-safe response
export function toClientError(error: Error | ApplicationError): {
  success: false;
  error: string;
  code?: string;
} {
  if (error instanceof ApplicationError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // For untyped errors, we don't reveal details in production
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    success: false,
    error: isProduction ? "Une erreur inattendue s'est produite" : error.message,
    code: 'UNKNOWN_ERROR',
  };
}
