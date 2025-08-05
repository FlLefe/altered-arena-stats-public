'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeString } from '@/lib/sanitization';
import { cn } from '@/lib/utils';
import { useOpponentSuggestions } from './useOpponentSuggestions';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function OpponentInput({ value, onChange }: Props) {
  const [input, setInput] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { suggestions, loading } = useOpponentSuggestions(input);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        // Transmit the entered value if it's not empty
        if (input.trim()) {
          onChange(input.trim());
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [input, onChange]);

  const handleSelect = (val: string) => {
    onChange(val);
    setInput(val);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((prev) => {
        if (prev === null) return 0;
        return Math.min(prev + 1, suggestions.length);
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((prev) => {
        if (prev === null) return suggestions.length;
        return Math.max(prev - 1, 0);
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlighted !== null && suggestions[highlighted]) {
        handleSelect(suggestions[highlighted].name);
      } else {
        handleSelect(input);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlighted(null);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        type="text"
        value={input}
        placeholder="Nom libre ou pseudo Altered"
        maxLength={25}
        onChange={(e) => {
          const sanitizedValue = sanitizeString(e.target.value);
          setInput(sanitizedValue);
          setOpen(true);
          setHighlighted(null);
        }}
        onFocus={() => {
          setOpen(true);
          setHighlighted(null);
        }}
        onBlur={() => {
          // Transmit the entered value if it's not empty
          if (input.trim()) {
            onChange(input.trim());
          }
        }}
        onKeyDown={handleKeyDown}
      />

      {open && (suggestions.length > 0 || input) && (
        <ul
          className={cn(
            'absolute z-10 mt-1 w-full max-h-60 overflow-auto text-sm rounded-md shadow-md',
            'bg-popover text-popover-foreground border border-border',
          )}
        >
          {loading && <li className="px-3 py-2 italic text-muted-foreground">Chargement...</li>}
          {suggestions.map((sugg, index) => (
            <li
              key={sugg.id ?? sugg.name}
              onMouseDown={() => handleSelect(sugg.name)}
              onMouseEnter={() => setHighlighted(index)}
              className={cn(
                'px-3 py-2 cursor-pointer transition-colors',
                'hover:bg-muted',
                highlighted === index && 'bg-muted text-foreground',
              )}
            >
              {sugg.name}
              <span className="text-xs text-muted-foreground ml-2">
                {sugg.id ? 'Joueur inscrit' : 'Libre'}
              </span>
            </li>
          ))}
          {input && !suggestions.some((s) => s.name.toLowerCase() === input.toLowerCase()) && (
            <li
              onMouseDown={() => handleSelect(input)}
              onMouseEnter={() => setHighlighted(suggestions.length)}
              className={cn(
                'px-3 py-2 italic cursor-pointer transition-colors',
                'hover:bg-muted',
                highlighted === suggestions.length && 'bg-muted text-foreground',
              )}
            >
              Utiliser &quot;{input}&quot;
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
