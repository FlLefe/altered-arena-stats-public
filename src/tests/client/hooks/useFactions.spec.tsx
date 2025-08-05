import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFactions } from '@/client/hooks/useFactions';
import { getAllFactionsAction } from '@/server/features/faction';

vi.mock('@/server/features/faction', () => ({
  getAllFactionsAction: vi.fn(),
}));

const mockGetAllFactionsAction = vi.mocked(getAllFactionsAction);

describe('useFactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    mockGetAllFactionsAction.mockResolvedValue([]);

    const { result } = renderHook(() => useFactions());

    expect(result.current.factions).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch factions successfully', async () => {
    const mockFactions = [
      {
        id: '1',
        name: 'Faction 1',
        colorCode: '#ff0000',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Faction 2',
        colorCode: '#00ff00',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
    mockGetAllFactionsAction.mockResolvedValue(mockFactions);

    const { result } = renderHook(() => useFactions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.factions).toEqual(mockFactions);
    expect(result.current.error).toBeNull();
    expect(mockGetAllFactionsAction).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching factions fails', async () => {
    const errorMessage = 'Erreur réseau';
    mockGetAllFactionsAction.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFactions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.factions).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockGetAllFactionsAction).toHaveBeenCalledTimes(1);
  });

  it('should handle non-Error exceptions', async () => {
    mockGetAllFactionsAction.mockRejectedValue('String error');

    const { result } = renderHook(() => useFactions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.factions).toEqual([]);
    expect(result.current.error).toBe('Une erreur est survenue');
    expect(mockGetAllFactionsAction).toHaveBeenCalledTimes(1);
  });

  it('should only fetch factions once on mount', async () => {
    mockGetAllFactionsAction.mockResolvedValue([]);

    renderHook(() => useFactions());

    await waitFor(() => {
      expect(mockGetAllFactionsAction).toHaveBeenCalledTimes(1);
    });
  });
});
