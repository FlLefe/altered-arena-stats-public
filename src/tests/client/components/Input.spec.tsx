import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('h-9');
  });

  it('should handle value and onChange', () => {
    const handleChange = vi.fn();
    render(<Input value="test value" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test value');

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should render with placeholder', () => {
    render(<Input placeholder="Entrez votre texte" />);

    const input = screen.getByPlaceholderText('Entrez votre texte');
    expect(input).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed');
  });

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="email" />);

    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('should have correct data-slot attribute', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn();
    const handleKeyUp = vi.fn();
    render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);

    fireEvent.keyUp(input, { key: 'Enter' });
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('should handle aria-invalid attribute', () => {
    render(<Input aria-invalid="true" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should handle required attribute', () => {
    render(<Input required />);

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('should handle readOnly attribute', () => {
    render(<Input readOnly />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('should handle name and id attributes', () => {
    render(<Input name="testName" id="testId" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'testName');
    expect(input).toHaveAttribute('id', 'testId');
  });

  it('should handle min and max attributes for number input', () => {
    render(<Input type="number" min="0" max="100" />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should handle step attribute for number input', () => {
    render(<Input type="number" step="0.1" />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('step', '0.1');
  });

  it('should handle pattern attribute', () => {
    render(<Input pattern="[A-Za-z]{3}" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]{3}');
  });

  it('should handle autoComplete attribute', () => {
    render(<Input autoComplete="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('should handle autoFocus attribute', () => {
    render(<Input autoFocus />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should handle multiple attributes', () => {
    render(<Input multiple />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('multiple');
  });

  it('should handle accept attribute for file input', () => {
    render(<Input type="file" accept=".pdf,.doc" />);

    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('accept', '.pdf,.doc');
  });

  it('should handle size attribute', () => {
    render(<Input size={20} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('size', '20');
  });

  it('should handle maxLength attribute', () => {
    render(<Input maxLength={50} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxlength', '50');
  });

  it('should handle defaultValue', () => {
    render(<Input defaultValue="default value" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('default value');
  });
});
