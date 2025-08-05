import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePaginatedData } from '@/client/hooks/usePaginatedData';

describe('usePaginatedData', () => {
  it('should return initial state', async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({
      success: true,
      data: { items: [], totalPages: 1 },
    });
    const { result } = renderHook(() => usePaginatedData(mockFetchFn, []));
    expect(result.current.query).toBe('');
    expect(result.current.page).toBe(1);
    expect(result.current.data).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.error).toBeNull();
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should fetch data successfully', async () => {
    const mockData = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    const mockFetchFn = vi.fn().mockResolvedValue({
      success: true,
      data: { items: mockData, totalPages: 3 },
    });
    const { result } = renderHook(() => usePaginatedData(mockFetchFn, []));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.error).toBeNull();
    expect(mockFetchFn).toHaveBeenCalledWith({ page: 1, query: '' });
  });

  it('should handle fetch error', async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({
      success: false,
      error: 'Erreur de chargement',
    });
    const { result } = renderHook(() => usePaginatedData(mockFetchFn, []));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.error).toBe('Erreur de chargement');
  });

  it('should handle fetch exception', async () => {
    const mockFetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => usePaginatedData(mockFetchFn, []));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.error).toBe('Une erreur est survenue lors du chargement des données');
  });

  it('should update page and refetch', async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({
      success: true,
      data: { items: [], totalPages: 1 },
    });
    const { result } = renderHook(() => usePaginatedData(mockFetchFn, []));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    act(() => {
      result.current.setPage(2);
    });
    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith({ page: 2, query: '' });
    });
  });

  it('should debounce query changes', async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({
      success: true,
      data: { items: [], totalPages: 1 },
    });
    const { result } = renderHook(() => usePaginatedData(mockFetchFn, []));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    act(() => {
      result.current.setQuery('test');
    });
    await new Promise((r) => setTimeout(r, 350));
    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith({ page: 1, query: 'test' });
    });
  });

  it('should call refetch manually', async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({
      success: true,
      data: { items: [], totalPages: 1 },
    });
    const { result } = renderHook(() => usePaginatedData(mockFetchFn, []));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const initialCallCount = mockFetchFn.mock.calls.length;
    await act(async () => {
      await result.current.refetch();
    });
    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledTimes(initialCallCount + 1);
    });
  });

  it('should use initial query', async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({
      success: true,
      data: { items: [], totalPages: 1 },
    });
    renderHook(() => usePaginatedData(mockFetchFn, [], 'initial query'));
    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith({ page: 1, query: 'initial query' });
    });
  });
});
