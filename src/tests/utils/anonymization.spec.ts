import { describe, it, expect } from 'vitest';
import { generateAnonymousAlias, isAnonymousAlias } from '@/utils/anonymization';

describe('Anonymization Utils', () => {
  describe('generateAnonymousAlias', () => {
    it('should generate an alias with prefix and numbers', () => {
      const alias = generateAnonymousAlias();

      // Vérifier le format: [Préfixe][1-4 chiffres]
      expect(alias).toMatch(/^[A-Za-z]+\d+$/);
      expect(alias.length).toBeGreaterThan(4); // Au moins un préfixe + chiffres
    });

    it('should generate different aliases on multiple calls', () => {
      const alias1 = generateAnonymousAlias();
      const alias2 = generateAnonymousAlias();
      const alias3 = generateAnonymousAlias();

      // Il est possible d'avoir des doublons, mais peu probable
      const aliases = [alias1, alias2, alias3];
      const uniqueAliases = new Set(aliases);

      // Au moins 2 sur 3 devraient être différents
      expect(uniqueAliases.size).toBeGreaterThanOrEqual(2);
    });

    it('should generate aliases with numbers between 1 and 9999', () => {
      for (let i = 0; i < 100; i++) {
        const alias = generateAnonymousAlias();
        const numbers = parseInt(alias.replace(/^[A-Za-z]+/, ''));

        expect(numbers).toBeGreaterThanOrEqual(1);
        expect(numbers).toBeLessThanOrEqual(9999);
      }
    });
  });

  describe('isAnonymousAlias', () => {
    it('should return true for valid anonymous aliases', () => {
      expect(isAnonymousAlias('Shadow42')).toBe(true);
      expect(isAnonymousAlias('Blade789')).toBe(true);
      expect(isAnonymousAlias('Phoenix1234')).toBe(true);
      expect(isAnonymousAlias('A1')).toBe(true);
      expect(isAnonymousAlias('Test9999')).toBe(true);
    });

    it('should return false for non-anonymous aliases', () => {
      expect(isAnonymousAlias('Shadow')).toBe(false);
      expect(isAnonymousAlias('42Shadow')).toBe(false);
      expect(isAnonymousAlias('Shadow42Test')).toBe(false);
      expect(isAnonymousAlias('')).toBe(false);
      expect(isAnonymousAlias('Shadow_42')).toBe(false);
      expect(isAnonymousAlias('Shadow-42')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isAnonymousAlias('123')).toBe(false);
      expect(isAnonymousAlias('ABC')).toBe(false);
      expect(isAnonymousAlias('Shadow0')).toBe(true);
    });
  });
});
