import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'px-3');
    expect(result).toBe('py-1 px-3');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should handle false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle objects with boolean values', () => {
    const result = cn('base-class', {
      'active-class': true,
      'inactive-class': false,
    });
    expect(result).toBe('base-class active-class');
  });

  it('should handle nested arrays', () => {
    const result = cn('base-class', [['nested1', 'nested2'], 'class3']);
    expect(result).toBe('base-class nested1 nested2 class3');
  });

  it('should handle empty strings and null values', () => {
    const result = cn('base-class', '', null, undefined, 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('should handle Tailwind CSS conflicts', () => {
    const result = cn('px-2 py-1 bg-red-500', 'px-4 bg-blue-500');
    expect(result).toBe('py-1 px-4 bg-blue-500');
  });

  it('should handle complex conditional logic', () => {
    const isPrimary = true;
    const isLarge = false;
    const result = cn(
      'base-button',
      isPrimary && 'bg-blue-500 text-white',
      isLarge && 'px-6 py-3',
      !isLarge && 'px-4 py-2',
    );
    expect(result).toBe('base-button bg-blue-500 text-white px-4 py-2');
  });

  it('should handle multiple conflicting classes', () => {
    const result = cn('text-sm font-medium', 'text-lg font-bold', 'text-base');
    expect(result).toBe('font-bold text-base');
  });

  it('should preserve non-Tailwind classes', () => {
    const result = cn('custom-class', 'px-2', 'another-custom');
    expect(result).toBe('custom-class px-2 another-custom');
  });

  it('should handle mixed Tailwind and custom classes', () => {
    const result = cn('custom-class px-2', 'px-4 custom-class-2');
    expect(result).toBe('custom-class px-4 custom-class-2');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle single class', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  it('should handle complex nested structures', () => {
    const theme: string = 'dark';
    const size: string = 'large';
    const result = cn(
      'base-component',
      {
        'dark-theme': theme === 'dark',
        'light-theme': theme === 'light',
      },
      [
        'size-base',
        {
          'size-large': size === 'large',
          'size-small': size === 'small',
        },
      ],
    );
    expect(result).toBe('base-component dark-theme size-base size-large');
  });
});
