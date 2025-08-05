'use client';

import { useState, useEffect } from 'react';

export function useScrollVisibility(threshold?: number) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use default value only on client side
    const defaultThreshold = typeof window !== 'undefined' ? window.innerHeight : 800;
    const actualThreshold = threshold ?? defaultThreshold;

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsVisible(window.scrollY > actualThreshold);
      }
    };

    // Check initial position on mount
    handleScroll();

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [threshold]);

  return isVisible;
}
