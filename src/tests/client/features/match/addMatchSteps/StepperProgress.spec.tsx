import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StepperProgress } from '@/client/features/match/addMatchSteps/StepperProgress';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
  };
});

describe('StepperProgress', () => {
  it('should render correct number of steps', () => {
    render(<StepperProgress step={1} total={5} />);

    const steps = screen.getAllByTestId('step');
    expect(steps).toHaveLength(5);
  });

  it('should render active steps correctly', () => {
    render(<StepperProgress step={3} total={5} />);

    const steps = screen.getAllByTestId('step');

    expect(steps[0]).toHaveClass('bg-primary');
    expect(steps[1]).toHaveClass('bg-primary');
    expect(steps[2]).toHaveClass('bg-primary');
    expect(steps[3]).toHaveClass('bg-muted');
    expect(steps[4]).toHaveClass('bg-muted');
  });

  it('should render all steps as active when step equals total', () => {
    render(<StepperProgress step={5} total={5} />);

    const steps = screen.getAllByTestId('step');

    steps.forEach((step) => {
      expect(step).toHaveClass('bg-primary');
    });
  });

  it('should render all steps as inactive when step is 1', () => {
    render(<StepperProgress step={1} total={3} />);

    const steps = screen.getAllByTestId('step');

    expect(steps[0]).toHaveClass('bg-primary');
    expect(steps[1]).toHaveClass('bg-muted');
    expect(steps[2]).toHaveClass('bg-muted');
  });

  it('should render single step correctly', () => {
    render(<StepperProgress step={1} total={1} />);

    const steps = screen.getAllByTestId('step');
    expect(steps).toHaveLength(1);
    expect(steps[0]).toHaveClass('bg-primary');
  });

  it('should have correct container classes', () => {
    render(<StepperProgress step={1} total={3} />);

    const container = screen.getByTestId('stepper-container');
    expect(container).toHaveClass('flex', 'justify-center', 'items-center', 'gap-2', 'py-2');
  });

  it('should have correct step classes', () => {
    render(<StepperProgress step={2} total={3} />);

    const steps = screen.getAllByTestId('step');

    steps.forEach((step) => {
      expect(step).toHaveClass('w-2', 'h-2', 'rounded-full', 'transition-colors');
    });
  });

  it('should handle step 0', () => {
    render(<StepperProgress step={0} total={3} />);

    const steps = screen.getAllByTestId('step');

    steps.forEach((step) => {
      expect(step).toHaveClass('bg-muted');
    });
  });

  it('should handle step greater than total', () => {
    render(<StepperProgress step={5} total={3} />);

    const steps = screen.getAllByTestId('step');

    steps.forEach((step) => {
      expect(step).toHaveClass('bg-primary');
    });
  });
});
