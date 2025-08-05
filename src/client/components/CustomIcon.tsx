'use client';

import React from 'react';
import { CustomIcons, IconName, getIcon, isValidIcon } from '@/constants/icons';
import { cn } from '@/lib/utils';

type Props = {
  name: IconName;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
};

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export function CustomIcon({ name, className, size = 'md' }: Props) {
  const iconChar = getIcon(name);

  return (
    <span
      className={cn('custom-icons inline-block', sizeClasses[size], className)}
      aria-label={`Icône ${name}`}
    >
      {iconChar}
    </span>
  );
}

// Component to display all available icons (useful for development)
export function IconGallery() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 p-4">
      {(Object.keys(CustomIcons) as IconName[]).map((iconName) => (
        <div
          key={iconName}
          className="flex flex-col items-center p-3 bg-surface rounded-lg border border-border hover:border-primary transition-colors"
        >
          <CustomIcon name={iconName} size="2xl" className="text-primary mb-2" />
          <span className="text-xs text-muted-foreground text-center">{iconName}</span>
        </div>
      ))}
    </div>
  );
}

// Hook to use icons in other components
export function useCustomIcon() {
  return {
    getIcon,
    isValidIcon,
    iconNames: Object.keys(CustomIcons) as IconName[],
  };
}
