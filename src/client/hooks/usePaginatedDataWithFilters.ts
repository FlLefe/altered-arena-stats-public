'use client';

import { useState, useEffect, useCallback } from 'react';

type PaginatedDataAction<T> = (params: {
  page: number;
  query: string;
  [key: string]: string | number;
}) => Promise<{
  success: boolean;
  data?: { items: T[]; totalPages: number };
  error?: string;
}>;

type UsePaginatedDataWithFiltersOptions<T> = {
  action: PaginatedDataAction<T>;
  initialData: T[];
  filters?: Record<string, string>;
};

export function usePaginatedDataWithFilters<T>({
  action,
  initialData,
  filters = {},
}: UsePaginatedDataWithFiltersOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(filters);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await action({
        page,
        query,
        ...activeFilters,
      });

      if (result.success && result.data) {
        setData(result.data.items);
        setTotalPages(result.data.totalPages);
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch {
      setError('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [action, page, query, activeFilters]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const setFilter = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filter changes
  }, []);

  const clearFilter = useCallback((key: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setPage(1);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    page,
    setPage,
    query,
    setQuery,
    totalPages,
    isLoading,
    error,
    refetch,
    activeFilters,
    setFilter,
    clearFilter,
    clearAllFilters,
  };
}
