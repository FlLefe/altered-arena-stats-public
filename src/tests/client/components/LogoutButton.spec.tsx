import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogoutButton } from '@/client/components/LogoutButton';
import { logoutUser } from '@/server/features';
import { withErrorHandling } from '@/tests/utils/test-helpers';

vi.mock('@/server/features', () => ({
  logoutUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const mockSignOut = vi.fn();
vi.mock('@/utils/supabase/browserClient', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signOut: mockSignOut,
    },
  })),
}));

const mockSetUser = vi.fn();
vi.mock('@/client/features/session', () => ({
  useUserSession: () => ({
    setUser: mockSetUser,
  }),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    startTransition: vi.fn((callback: () => void) => {
      Promise.resolve().then(() => {
        try {
          callback();
        } catch {}
      });
    }),
  };
});

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render logout button with correct text', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: 'Se déconnecter' });
    expect(button).toBeInTheDocument();
  });

  it('should have destructive variant', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r');
    expect(button).toHaveClass('from-button-destructive');
  });

  it('should handle logout when clicked', async () => {
    (logoutUser as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    mockSignOut.mockResolvedValue({ error: null });

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });

  it('should handle logout errors gracefully', async () => {
    await withErrorHandling(async () => {
      const error = new Error('Logout failed');
      (logoutUser as ReturnType<typeof vi.fn>).mockRejectedValue(error);
      mockSignOut.mockResolvedValue({ error: null });

      render(<LogoutButton />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(
        () => {
          expect(logoutUser).toHaveBeenCalledTimes(1);
        },
        { timeout: 1000 },
      );

      expect(mockSignOut).not.toHaveBeenCalled();

      expect(mockSetUser).not.toHaveBeenCalled();
    });
  });

  it('should handle Supabase signOut errors gracefully', async () => {
    (logoutUser as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    mockSignOut.mockResolvedValue({ error: { message: 'SignOut failed' } });

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });

  it('should be clickable and accessible', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });
});
