'use client';

import React, { useEffect, useState } from 'react';
import { useDebounce } from '@/client/hooks';
import { Input } from '@/components/ui/input';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = 'Rechercher...',
  debounceDelay = 300,
  className,
}: Props) {
  const [localValue, setLocalValue] = useState(value);

  const debouncedValue = useDebounce(localValue, debounceDelay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Input
      type="search"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}
