import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from '@/client/components/shared/Pagination';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
  };
});

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should render pagination avec le texte fractionné', () => {
    render(<Pagination page={1} totalPages={10} onPageChange={mockOnPageChange} />);
    const pageText = screen.getByText((content, element) => {
      return element?.textContent === 'Page 1 / 10';
    });
    expect(pageText).toBeInTheDocument();
  });

  it('should render previous and next buttons (flèches)', () => {
    render(<Pagination page={5} totalPages={10} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('←')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('should disable previous button on first page', () => {
    render(<Pagination page={1} totalPages={10} onPageChange={mockOnPageChange} />);
    const prevButton = screen.getByText('←').closest('button');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Pagination page={10} totalPages={10} onPageChange={mockOnPageChange} />);
    const nextButton = screen.getByText('→').closest('button');
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when next button is clicked', () => {
    render(<Pagination page={1} totalPages={10} onPageChange={mockOnPageChange} />);
    const nextButton = screen.getByText('→').closest('button');
    fireEvent.click(nextButton!);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button is clicked', () => {
    render(<Pagination page={5} totalPages={10} onPageChange={mockOnPageChange} />);
    const prevButton = screen.getByText('←').closest('button');
    fireEvent.click(prevButton!);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('should handle single page correctly', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={mockOnPageChange} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should handle edge case with zero pages', () => {
    const { container } = render(
      <Pagination page={1} totalPages={0} onPageChange={mockOnPageChange} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should handle large page numbers', () => {
    render(<Pagination page={999} totalPages={1000} onPageChange={mockOnPageChange} />);
    const pageText = screen.getByText((content, element) => {
      return element?.textContent === 'Page 999 / 1000';
    });
    expect(pageText).toBeInTheDocument();
  });

  it('should not call onPageChange when disabled buttons are clicked', () => {
    render(<Pagination page={1} totalPages={10} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByText('←').closest('button');

    fireEvent.click(prevButton!);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should render with custom className', () => {
    render(
      <Pagination
        page={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
        className="custom-class"
      />,
    );

    const container = screen.getByTestId('pagination-container');
    expect(container).toHaveClass('custom-class');
  });
});
