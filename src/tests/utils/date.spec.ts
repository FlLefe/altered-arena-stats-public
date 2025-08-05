import { describe, it, expect } from 'vitest';
import { parseDateString, isValidFrenchDate, parseFrenchDate } from '@/utils/date';

describe('Date Utils', () => {
  describe('parseDateString', () => {
    it('should parse a valid date string', () => {
      const dateString = '2024-01-15';
      const result = parseDateString(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January = 0
      expect(result?.getDate()).toBe(15);
    });

    it('should return null for empty string', () => {
      const result = parseDateString('');
      expect(result).toBeNull();
    });

    it('should return null for undefined', () => {
      const result = parseDateString(undefined);
      expect(result).toBeNull();
    });

    it('should return null for null', () => {
      const result = parseDateString(null);
      expect(result).toBeNull();
    });

    it('should return null for invalid date string', () => {
      const result = parseDateString('invalid-date');
      expect(result).toBeNull();
    });

    it('should return null for whitespace string', () => {
      const result = parseDateString('   ');
      expect(result).toBeNull();
    });
  });

  describe('isValidFrenchDate', () => {
    it('should validate correct French date format DD-MM-YYYY', () => {
      expect(isValidFrenchDate('15-01-2024')).toBe(true);
      expect(isValidFrenchDate('01-12-2024')).toBe(true);
      expect(isValidFrenchDate('29-02-2024')).toBe(true); // Leap year
      expect(isValidFrenchDate('05-09-2024')).toBe(true); // With zeros
    });

    it('should reject invalid French date format', () => {
      expect(isValidFrenchDate('2024-01-15')).toBe(false); // International format
      expect(isValidFrenchDate('15/01/2024')).toBe(false); // Slash instead of hyphen
      expect(isValidFrenchDate('15-1-2024')).toBe(false); // Month without zero
      expect(isValidFrenchDate('1-01-2024')).toBe(false); // Day without zero
      expect(isValidFrenchDate('32-01-2024')).toBe(false); // Invalid day
      expect(isValidFrenchDate('15-13-2024')).toBe(false); // Invalid month
      expect(isValidFrenchDate('29-02-2023')).toBe(false); // 29 February non leap year
    });

    it('should reject invalid strings', () => {
      expect(isValidFrenchDate('')).toBe(false);
      expect(isValidFrenchDate('invalid')).toBe(false);
      expect(isValidFrenchDate('15-01')).toBe(false); // Year missing
    });
  });

  describe('parseFrenchDate', () => {
    it('should parse valid French date format', () => {
      const result = parseFrenchDate('15-01-2024');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January = 0
      expect(result.getDate()).toBe(15);
    });

    it('should handle leap year correctly', () => {
      const result = parseFrenchDate('29-02-2024');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1); // February = 1
      expect(result.getDate()).toBe(29);
    });

    it('should handle zero-padded day and month', () => {
      const result = parseFrenchDate('05-09-2024');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(8); // September = 8
      expect(result.getDate()).toBe(5);
    });
  });
});
