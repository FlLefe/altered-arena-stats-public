import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { ValidationError } from '@/lib/errors';
import {
  validateWithZod,
  validateWithZodResult,
  createValidationMessage,
  validateAuthentication,
  validateAdminAccess,
  validateResourceExists,
  validateBusinessRule,
} from '@/lib/validation';

describe('Validation utilities', () => {
  describe('validateWithZod', () => {
    const userSchema = z.object({
      name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
      email: z.string().email('Email invalide'),
      age: z.number().min(18, "L'âge doit être d'au moins 18 ans"),
    });

    it('should validate correct data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      };

      const result = validateWithZod(userSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should throw ValidationError for invalid data', () => {
      const invalidData = {
        name: 'J',
        email: 'invalid-email',
        age: 16,
      };

      expect(() => validateWithZod(userSchema, invalidData)).toThrow(ValidationError);
    });

    it('should include field path in error details', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        age: 25,
      };

      try {
        validateWithZod(userSchema, invalidData);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details?.field).toBe('email');
      }
    });

    it('should include context in error details', () => {
      const invalidData = { name: 'J' };
      const context = 'user-registration';

      try {
        validateWithZod(userSchema, invalidData, context);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details?.context).toBe(context);
      }
    });
  });

  describe('validateWithZodResult', () => {
    const simpleSchema = z.string().min(3, 'Trop court');

    it('should return success result for valid data', () => {
      const result = validateWithZodResult(simpleSchema, 'valid');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('valid');
      }
    });

    it('should return error result for invalid data', () => {
      const result = validateWithZodResult(simpleSchema, 'ab');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Trop court');
        expect(result.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle unexpected errors', () => {
      const mockSchema = {
        safeParse: vi.fn().mockImplementation(() => {
          throw new Error('Unexpected error');
        }),
      } as unknown as z.ZodSchema<string>;

      const result = validateWithZodResult(mockSchema, 'test');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Erreur de validation');
        expect(result.code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('createValidationMessage', () => {
    it('should create formatted validation message', () => {
      const result = createValidationMessage('email', 'Email invalide');
      expect(result).toBe('email: Email invalide');
    });

    it('should handle nested field paths', () => {
      const result = createValidationMessage('user.email', 'Email invalide');
      expect(result).toBe('user.email: Email invalide');
    });
  });

  describe('validateAuthentication', () => {
    it('should pass for valid session', () => {
      const validSession = { type: 'success', data: { id: '1' } };

      expect(() => validateAuthentication(validSession)).not.toThrow();
    });

    it('should throw unauthorized for null session', () => {
      expect(() => validateAuthentication(null)).toThrow();
    });

    it('should throw unauthorized for undefined session', () => {
      expect(() => validateAuthentication(undefined)).toThrow();
    });

    it('should throw unauthorized for session without success type', () => {
      const invalidSession = { type: 'error', data: { id: '1' } };

      expect(() => validateAuthentication(invalidSession)).toThrow();
    });
  });

  describe('validateAdminAccess', () => {
    it('should pass for admin session', () => {
      const adminSession = {
        type: 'success',
        data: { id: '1', role: 'admin' },
      };

      expect(() => validateAdminAccess(adminSession)).not.toThrow();
    });

    it('should throw unauthorized for invalid session', () => {
      expect(() => validateAdminAccess(null)).toThrow();
    });

    it('should throw forbidden for non-admin user', () => {
      const userSession = {
        type: 'success',
        data: { id: '1', role: 'user' },
      };

      expect(() => validateAdminAccess(userSession)).toThrow();
    });
  });

  describe('validateResourceExists', () => {
    it('should return resource when it exists', () => {
      const resource = { id: '1', name: 'Test' };
      const result = validateResourceExists(resource, 'User');

      expect(result).toBe(resource);
    });

    it('should throw not found when resource is null', () => {
      expect(() => validateResourceExists(null, 'User')).toThrow();
    });

    it('should throw not found when resource is undefined', () => {
      expect(() => validateResourceExists(undefined, 'User')).toThrow();
    });

    it('should include resource name in error message', () => {
      try {
        validateResourceExists(null, 'User');
      } catch (error) {
        expect((error as Error).message).toContain('User');
      }
    });
  });

  describe('validateBusinessRule', () => {
    it('should pass when condition is true', () => {
      expect(() => validateBusinessRule(true, 'Test message')).not.toThrow();
    });

    it('should throw business rule error when condition is false', () => {
      expect(() => validateBusinessRule(false, 'Test message')).toThrow();
    });

    it('should include message in error', () => {
      const message = 'Règle métier violée';

      try {
        validateBusinessRule(false, message);
      } catch (error) {
        expect((error as Error).message).toBe(message);
      }
    });
  });
});
