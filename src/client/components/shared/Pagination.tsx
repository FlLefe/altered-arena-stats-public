'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ page, totalPages, onPageChange, className }: Props) {
  // Don't display pagination if there is only one page
  if (totalPages <= 1) {
    return null;
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      data-testid="pagination-container"
      className={`flex items-center justify-between gap-4 ${className ?? ''}`}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
      >
        ←
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
      >
        →
      </Button>
    </div>
  );
}
