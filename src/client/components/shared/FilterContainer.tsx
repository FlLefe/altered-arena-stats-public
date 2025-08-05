'use client';

import { ReactNode } from 'react';

type FilterContainerProps = {
  children: ReactNode;
  className?: string;
};

export function FilterContainer({ children, className = '' }: FilterContainerProps) {
  return (
    <div className={`flex items-center gap-2 flex-wrap justify-center ${className}`}>
      {children}
    </div>
  );
}
