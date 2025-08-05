import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeComment } from '@/lib/sanitization';

describe('sanitization', () => {
  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World');
    });

    it('should remove dangerous attributes', () => {
      const input = '<img src="x" onerror="alert(1)">';
      const result = sanitizeString(input);
      expect(result).toBe('');
    });

    it('should preserve safe text', () => {
      const input = 'Hello World! This is safe text.';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World! This is safe text.');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeString(input);
      expect(result).toBe('');
    });

    it('should handle special characters', () => {
      const input = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const result = sanitizeString(input);
      expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });
  });

  describe('sanitizeComment', () => {
    it('should allow basic formatting tags', () => {
      const input = 'This is <b>bold</b> and <i>italic</i> text.';
      const result = sanitizeComment(input);
      expect(result).toContain('<b>bold</b>');
      expect(result).toContain('<i>italic</i>');
    });

    it('should remove dangerous tags', () => {
      const input = 'This is <script>alert("xss")</script> dangerous.';
      const result = sanitizeComment(input);
      expect(result).toBe('This is  dangerous.');
    });

    it('should remove dangerous attributes', () => {
      const input = '<b onclick="alert(1)">bold</b>';
      const result = sanitizeComment(input);
      expect(result).toBe('<b>bold</b>');
    });

    it('should preserve safe text', () => {
      const input = 'Hello World! This is safe text.';
      const result = sanitizeComment(input);
      expect(result).toBe('Hello World! This is safe text.');
    });
  });
});
