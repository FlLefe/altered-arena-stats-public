import { describe, it, expect, vi } from 'vitest';
import { retryUntilTruthy } from '@/utils/retry';

describe('Retry Utils', () => {
  describe('retryUntilTruthy', () => {
    it('should return result immediately if function succeeds on first try', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await retryUntilTruthy(mockFn);
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('should retry and succeed on second attempt', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce('success');
      const result = await retryUntilTruthy(mockFn, { delayMs: 1 });
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
    it('should retry and succeed on third attempt', async () => {
      const mockFn = vi
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('success');
      const result = await retryUntilTruthy(mockFn, { delayMs: 1 });
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
    it('should return null after all attempts fail', async () => {
      const mockFn = vi.fn().mockResolvedValue(null);
      const result = await retryUntilTruthy(mockFn, { delayMs: 1 });
      expect(result).toBeNull();
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
    it('should respect custom attempts option', async () => {
      const mockFn = vi.fn().mockResolvedValue(null);
      const result = await retryUntilTruthy(mockFn, { attempts: 5, delayMs: 1 });
      expect(result).toBeNull();
      expect(mockFn).toHaveBeenCalledTimes(5);
    });
    it('should respect custom delay option', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce('success');
      const start = Date.now();
      const result = await retryUntilTruthy(mockFn, { delayMs: 10 });
      const duration = Date.now() - start;
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(duration).toBeGreaterThanOrEqual(10);
    });
    it('should handle undefined return value', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce(undefined).mockResolvedValueOnce('success');
      const result = await retryUntilTruthy(mockFn, { delayMs: 1 });
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
    it('should handle empty string as valid value', async () => {
      const mockFn = vi.fn().mockResolvedValue('');
      const result = await retryUntilTruthy(mockFn, { delayMs: 1 });
      expect(result).toBe('');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('should handle zero as truthy value', async () => {
      const mockFn = vi.fn().mockResolvedValue(0);
      const result = await retryUntilTruthy(mockFn);
      expect(result).toBe(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('should handle false as truthy value', async () => {
      const mockFn = vi.fn().mockResolvedValue(false);
      const result = await retryUntilTruthy(mockFn);
      expect(result).toBe(false);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
