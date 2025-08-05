import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('should render with default props', () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('should apply custom className', () => {
    render(<Label className="custom-class">Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-class');
  });

  it('should have correct default CSS classes', () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(
      'flex',
      'items-center',
      'py-1',
      'gap-2',
      'text-sm',
      'leading-none',
      'font-medium',
      'select-none',
      'group-data-[disabled=true]:pointer-events-none',
      'group-data-[disabled=true]:opacity-50',
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-50',
    );
  });

  it('should pass through additional props', () => {
    render(
      <Label htmlFor="test-input" data-testid="test-label">
        Test Label
      </Label>,
    );

    const label = screen.getByTestId('test-label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('should render with htmlFor attribute', () => {
    render(<Label htmlFor="input-id">Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'input-id');
  });

  it('should render with id attribute', () => {
    render(<Label id="label-id">Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('id', 'label-id');
  });

  it('should render with aria-label attribute', () => {
    render(<Label aria-label="Accessible Label">Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('aria-label', 'Accessible Label');
  });

  it('should render with children', () => {
    render(
      <Label>
        <span>Complex</span> <strong>Label</strong> <em>Content</em>
      </Label>,
    );

    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    render(<Label data-testid="empty-label" />);

    const label = screen.getByTestId('empty-label');
    expect(label).toBeInTheDocument();
  });
});
