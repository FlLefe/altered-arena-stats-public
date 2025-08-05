import { describe, it, expect } from 'vitest';
import { validateAndConvertToBigInt } from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateAndConvertToBigInt', () => {
    it('should convert valid string number to bigint', () => {
      const result = validateAndConvertToBigInt('123', 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(BigInt(123));
      }
    });

    it('should convert valid number to bigint', () => {
      const result = validateAndConvertToBigInt(456, 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(BigInt(456));
      }
    });

    it('should convert valid bigint to bigint', () => {
      const result = validateAndConvertToBigInt(BigInt(789), 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(BigInt(789));
      }
    });

    it('should return null for null input', () => {
      const result = validateAndConvertToBigInt(null, 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should return null for undefined input', () => {
      const result = validateAndConvertToBigInt(undefined, 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should return null for empty string', () => {
      const result = validateAndConvertToBigInt('', 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should return null for whitespace string', () => {
      const result = validateAndConvertToBigInt('   ', 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should return error for invalid string', () => {
      const result = validateAndConvertToBigInt('abc', 'test');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('test doit être un nombre valide');
      }
    });

    it('should return error for zero', () => {
      const result = validateAndConvertToBigInt(0, 'test');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('test doit être un nombre valide');
      }
    });

    it('should return error for negative number', () => {
      const result = validateAndConvertToBigInt(-1, 'test');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('test doit être un nombre valide');
      }
    });

    it('should return error for NaN', () => {
      const result = validateAndConvertToBigInt(NaN, 'test');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('test doit être un nombre valide');
      }
    });
  });
});
