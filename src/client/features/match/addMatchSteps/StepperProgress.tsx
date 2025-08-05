import React from 'react';

type Props = {
  step: number;
  total: number;
};

export function StepperProgress({ step, total }: Props) {
  return (
    <div
      data-testid="stepper-container"
      role="presentation"
      className="flex justify-center items-center gap-2 py-2"
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          data-testid="step"
          role="presentation"
          className={`w-2 h-2 rounded-full transition-colors ${
            step - 1 >= i ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
}
