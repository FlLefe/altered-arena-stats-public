'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollVisibility } from '@/client/hooks/useScrollVisibility';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const isVisible = useScrollVisibility();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-20 right-5 md:right-7 z-30 bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-xl rounded-full w-12 h-12 transition-all duration-300',
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none',
      )}
      size="icon"
      aria-label="Retour en haut de page"
    >
      <ArrowUp size={20} />
    </Button>
  );
}
