import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSeasons } from '@/client/hooks/useSeasons';
import { getAllSeasonsAction } from '@/server/features/season';

vi.mock('@/server/features/season', () => ({
  getAllSeasonsAction: vi.fn(),
}));

const mockGetAllSeasonsAction = vi.mocked(getAllSeasonsAction);

describe('useSeasons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    mockGetAllSeasonsAction.mockResolvedValue([]);

    const { result } = renderHook(() => useSeasons());

    expect(result.current.seasons).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch seasons successfully', async () => {
    const mockSeasons = [
      {
        id: '1',
        name: 'Saison 1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Saison 2',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        isActive: false,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ];
    mockGetAllSeasonsAction.mockResolvedValue(mockSeasons);

    const { result } = renderHook(() => useSeasons());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.seasons).toEqual(mockSeasons);
    expect(result.current.error).toBeNull();
    expect(mockGetAllSeasonsAction).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching seasons fails', async () => {
    const errorMessage = 'Erreur réseau';
    mockGetAllSeasonsAction.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSeasons());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.seasons).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockGetAllSeasonsAction).toHaveBeenCalledTimes(1);
  });

  it('should handle non-Error exceptions', async () => {
    mockGetAllSeasonsAction.mockRejectedValue('String error');

    const { result } = renderHook(() => useSeasons());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.seasons).toEqual([]);
    expect(result.current.error).toBe('Une erreur est survenue');
    expect(mockGetAllSeasonsAction).toHaveBeenCalledTimes(1);
  });

  it('should only fetch seasons once on mount', () => {
    mockGetAllSeasonsAction.mockResolvedValue([]);

    renderHook(() => useSeasons());

    expect(mockGetAllSeasonsAction).toHaveBeenCalledTimes(1);
  });
});
