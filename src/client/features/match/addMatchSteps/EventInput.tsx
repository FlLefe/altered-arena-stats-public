'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { sanitizeString } from '@/lib/sanitization';
import { cn } from '@/lib/utils';
import { useEventSuggestions } from './useEventSuggestions';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function EventInput({ value, onChange }: Props) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions, generics, loading } = useEventSuggestions(input);
  const allOptions = useMemo(() => [...suggestions, ...generics], [suggestions, generics]);

  const selectedEvent = allOptions.find((e) => e.id === value);
  const displayValue = selectedEvent ? selectedEvent.name : input;

  // Validation: either we have an event selected by ID, or we have a match by name
  const isValidSelection =
    selectedEvent !== undefined ||
    allOptions.some((e) => e.name.toLowerCase() === input.toLowerCase());

  useEffect(() => {
    if (!selectedEvent && !input) {
      setInput('');
    }
  }, [value, selectedEvent, input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHasBlurred(true);

        if (!isValidSelection) {
          setInput('');
          onChange('');
        } else if (!selectedEvent && input) {
          const exactMatch = allOptions.find((e) => e.name.toLowerCase() === input.toLowerCase());
          if (exactMatch) {
            onChange(exactMatch.id);
            setInput(exactMatch.name);
          }
        }

        setTouched(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [input, isValidSelection, onChange, selectedEvent, allOptions]);

  const handleSelect = (eventId: string, eventName: string) => {
    onChange(eventId);
    setInput(eventName);
    setOpen(false);
    setTouched(false);
    setHasBlurred(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    const totalOptions = allOptions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((prev) => {
        if (prev === null) return 0;
        return Math.min(prev + 1, totalOptions - 1);
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((prev) => {
        if (prev === null) return totalOptions - 1;
        return Math.max(prev - 1, 0);
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlighted !== null && allOptions[highlighted]) {
        const event = allOptions[highlighted];
        handleSelect(event.id, event.name);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlighted(null);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />

      <Input
        type="text"
        value={displayValue}
        maxLength={25}
        placeholder="Rechercher un tournoi ou choisir une catégorie"
        onChange={(e) => {
          const sanitizedValue = sanitizeString(e.target.value);
          setInput(sanitizedValue);
          setOpen(true);
          setHighlighted(null);
          setTouched(true);
          setHasBlurred(false);
        }}
        onFocus={() => {
          setOpen(true);
          setHighlighted(null);
        }}
        onBlur={() => {
          setHasBlurred(true);
          // Reset input when leaving the field
          if (!selectedEvent) {
            setInput('');
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'pl-9',
          hasBlurred && touched && !isValidSelection
            ? 'border-destructive focus:border-destructive focus:ring-destructive'
            : '',
        )}
      />

      {open && allOptions.length > 0 && (
        <ul
          className={cn(
            'absolute z-10 mt-1 w-full max-h-60 overflow-auto text-sm rounded-md shadow-md',
            'bg-popover text-popover-foreground border border-border',
          )}
        >
          {loading && <li className="px-3 py-2 italic text-muted-foreground">Chargement...</li>}

          {generics.map((event, index) => (
            <li
              key={`g-${event.id}`}
              onMouseDown={() => handleSelect(event.id, event.name)}
              onMouseEnter={() => setHighlighted(index)}
              className={cn(
                'px-3 py-2 cursor-pointer transition-colors',
                'hover:bg-muted',
                highlighted === index && 'bg-muted text-foreground',
              )}
            >
              {event.name}
              <span className="text-xs text-muted-foreground ml-2">Générique</span>
            </li>
          ))}

          {suggestions.map((sugg, index) => (
            <li
              key={`s-${sugg.id}`}
              onMouseDown={() => handleSelect(sugg.id, sugg.name)}
              onMouseEnter={() => setHighlighted(index + generics.length)}
              className={cn(
                'px-3 py-2 cursor-pointer transition-colors',
                'hover:bg-muted',
                highlighted === index + generics.length && 'bg-muted text-foreground',
              )}
            >
              {sugg.name}
              <span className="text-xs text-muted-foreground ml-2">Tournoi existant</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
