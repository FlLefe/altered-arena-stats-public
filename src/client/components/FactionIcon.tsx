'use client';

import React from 'react';
import { CustomIcons, isValidIcon, getIcon } from '@/constants/icons';
import { cn } from '@/lib/utils';

type Props = {
  factionName: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showFallback?: boolean;
  color?: string;
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

export function FactionIcon({
  factionName,
  className,
  size = 'md',
  showFallback = true,
  color,
}: Props) {
  const iconName = factionName as keyof typeof CustomIcons;
  const iconChar = isValidIcon(iconName) ? getIcon(iconName) : '?';

  // If the icon doesn't exist and we don't want a fallback
  if (iconChar === '?' && !showFallback) {
    return null;
  }

  // If the icon doesn't exist but we have a color, display a dot
  if (iconChar === '?' && color) {
    return (
      <span
        className={cn('inline-block rounded-full', sizeClasses[size], className)}
        style={{
          backgroundColor: color,
          verticalAlign: 'middle',
          lineHeight: '1',
          display: 'inline-flex',
          alignItems: 'center',
        }}
        aria-label={`Couleur de la faction ${factionName}`}
        title={factionName}
      />
    );
  }

  // If the icon doesn't exist and no color, display a gray dot
  if (iconChar === '?') {
    return (
      <span
        className={cn('inline-block rounded-full bg-gray-400', sizeClasses[size], className)}
        style={{
          verticalAlign: 'middle',
          lineHeight: '1',
          display: 'inline-flex',
          alignItems: 'center',
        }}
        aria-label={`Faction ${factionName} (icône non disponible)`}
        title={factionName}
      />
    );
  }

  return (
    <span
      className={cn('custom-icons inline-block', sizeClasses[size], className)}
      style={{
        ...(color ? { color } : {}),
        verticalAlign: 'middle',
        lineHeight: '1',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      aria-label={`Icône de la faction ${factionName}`}
      title={factionName}
    >
      {iconChar}
    </span>
  );
}
