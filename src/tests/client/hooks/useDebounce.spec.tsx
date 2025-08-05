import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from '@/client/hooks';

function TestComponent({ value }: { value: string }) {
  const debounced = useDebounce(value, 300);
  return <div data-testid="debounced">{debounced}</div>;
}

describe('useDebounce (without renderHook)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    render(<TestComponent value="initial" />);
    expect(screen.getByTestId('debounced').textContent).toBe('initial');
  });

  it('updates the value after the debounce delay', () => {
    const { rerender } = render(<TestComponent value="one" />);

    rerender(<TestComponent value="two" />);
    expect(screen.getByTestId('debounced').textContent).toBe('one');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('debounced').textContent).toBe('two');
  });
});
