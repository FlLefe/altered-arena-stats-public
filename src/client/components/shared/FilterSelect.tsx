'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  width?: string;
  showClearButton?: boolean;
  onClear?: () => void;
};

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  width = 'w-40',
  showClearButton = true,
  onClear,
}: FilterSelectProps) {
  const handleClear = () => {
    // Determine default value based on available options
    const defaultOption = options.find(
      (option) => option.value === 'all' || option.value === 'ALL',
    );
    onValueChange(defaultOption?.value || options[0]?.value || '');
    onClear?.();
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={width}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showClearButton && value !== 'all' && value !== 'ALL' && (
        <div className="w-9 h-9 sm:w-9 sm:h-9 flex items-center justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            className="text-destructive hover:text-destructive h-10 w-10 sm:h-9 sm:w-9 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
