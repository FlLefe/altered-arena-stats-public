import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

type FetchFn<T> = (args: { page: number; query: string }) => Promise<{
  success: boolean;
  data?: {
    items: T[];
    totalPages: number;
  };
  error?: string;
  code?: string;
}>;

export function usePaginatedData<T>(fetchFn: FetchFn<T>, initialData: T[], initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>(initialData);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn({ page, query: debouncedQuery });
      if (result.success && result.data) {
        setData(result.data.items);
        setTotalPages(result.data.totalPages);
      } else {
        setError(result.error || 'Une erreur est survenue');
        setData([]);
        setTotalPages(1);
      }
    } catch {
      setError('Une erreur est survenue lors du chargement des données');
      setData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, debouncedQuery]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    query,
    setQuery,
    page,
    setPage,
    data,
    totalPages,
    isLoading,
    error,
    refetch,
  };
}
