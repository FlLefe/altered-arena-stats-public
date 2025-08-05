import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchInput } from '@/client/components/shared/SearchInput';

describe('SearchInput', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render with default props', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Rechercher...');
  });

  it('should render with custom placeholder', () => {
    render(
      <SearchInput value="" onChange={mockOnChange} placeholder="Rechercher des joueurs..." />,
    );
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'Rechercher des joueurs...');
  });

  it('should display initial value', () => {
    render(<SearchInput value="initial value" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('initial value');
  });

  it('should update local value immediately when typing', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('should call onChange with debounced value', async () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    mockOnChange.mockClear();
    await new Promise((resolve) => setTimeout(resolve, 350));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });
  }, 10000);

  it('should use custom debounce delay', async () => {
    render(<SearchInput value="" onChange={mockOnChange} debounceDelay={500} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    mockOnChange.mockClear();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(mockOnChange).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 250));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });
  }, 10000);

  it('should apply custom className', () => {
    render(<SearchInput value="" onChange={mockOnChange} className="custom-class" />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle multiple rapid changes', async () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    mockOnChange.mockClear();
    await new Promise((resolve) => setTimeout(resolve, 350));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('abc');
    });
  }, 10000);

  it('should update local value when prop value changes', async () => {
    const { rerender } = render(<SearchInput value="initial" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('initial');
    rerender(<SearchInput value="updated" onChange={mockOnChange} />);
    await waitFor(() => {
      expect(input).toHaveValue('updated');
    });
  }, 10000);
});
