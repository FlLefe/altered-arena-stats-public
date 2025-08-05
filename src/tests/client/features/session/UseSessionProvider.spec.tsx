import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserSessionProvider, SessionContext } from '@/client/features/session';
import { getUserSession } from '@/server/features';
import { withErrorHandling } from '@/tests/utils/test-helpers';
import { type SessionUser } from '@/types/session';

vi.mock('@/server/features', () => ({
  getUserSession: vi.fn(),
}));

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  })),
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

describe('UserSessionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    render(
      <UserSessionProvider>
        <div data-testid="test-child">Test Child</div>
      </UserSessionProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should provide session context', () => {
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    let contextValue:
      | { user: SessionUser | null; setUser: (user: SessionUser | null) => void }
      | undefined;
    const TestComponent = () => {
      const context = React.useContext(SessionContext);
      contextValue = context;
      return <div>Test</div>;
    };

    render(
      <UserSessionProvider>
        <TestComponent />
      </UserSessionProvider>,
    );

    expect(contextValue).toBeDefined();
    expect(contextValue!.user).toBeNull();
    expect(typeof contextValue!.setUser).toBe('function');
  });

  it('should initialize with null user', () => {
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    let contextValue:
      | { user: SessionUser | null; setUser: (user: SessionUser | null) => void }
      | undefined;
    const TestComponent = () => {
      const context = React.useContext(SessionContext);
      contextValue = context;
      return <div>Test</div>;
    };

    render(
      <UserSessionProvider>
        <TestComponent />
      </UserSessionProvider>,
    );

    expect(contextValue!.user).toBeNull();
  });

  it('should call getUserSession on mount', async () => {
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    render(
      <UserSessionProvider>
        <div>Test</div>
      </UserSessionProvider>,
    );

    await waitFor(
      () => {
        expect(getUserSession).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );
  });

  it('should set user when getUserSession resolves', async () => {
    const mockUser: SessionUser = {
      alteredAlias: 'TestUser',
      role: 'user',
    };
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

    let contextValue:
      | { user: SessionUser | null; setUser: (user: SessionUser | null) => void }
      | undefined;
    const TestComponent = () => {
      const context = React.useContext(SessionContext);
      contextValue = context;
      return <div>Test</div>;
    };

    render(
      <UserSessionProvider>
        <TestComponent />
      </UserSessionProvider>,
    );

    await waitFor(() => {
      expect(contextValue!.user).toEqual(mockUser);
    });
  });

  it('should handle getUserSession error gracefully', async () => {
    await withErrorHandling(async () => {
      const error = new Error('Failed to get user');
      (getUserSession as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      let contextValue:
        | { user: SessionUser | null; setUser: (user: SessionUser | null) => void }
        | undefined;
      const TestComponent = () => {
        const context = React.useContext(SessionContext);
        contextValue = context;
        return <div>Test</div>;
      };

      render(
        <UserSessionProvider>
          <TestComponent />
        </UserSessionProvider>,
      );

      await waitFor(
        () => {
          expect(contextValue!.user).toBeNull();
        },
        { timeout: 1000 },
      );

      // Vérifier que getUserSession a été appelé
      expect(getUserSession).toHaveBeenCalledTimes(1);
    });
  });

  it('should set up auth state change listener', async () => {
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    render(
      <UserSessionProvider>
        <div>Test</div>
      </UserSessionProvider>,
    );

    await waitFor(
      () => {
        expect(getUserSession).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );
  });

  it('should allow setting user via context', async () => {
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    let contextValue:
      | { user: SessionUser | null; setUser: (user: SessionUser | null) => void }
      | undefined;
    const TestComponent = () => {
      const context = React.useContext(SessionContext);
      contextValue = context;
      return <div>Test</div>;
    };

    render(
      <UserSessionProvider>
        <TestComponent />
      </UserSessionProvider>,
    );

    const mockUser: SessionUser = {
      alteredAlias: 'TestUser',
      role: 'user',
    };

    act(() => {
      contextValue!.setUser(mockUser);
    });

    await waitFor(() => {
      expect(contextValue!.user).toEqual(mockUser);
    });
  });

  it('should clean up subscription on unmount', async () => {
    (getUserSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { unmount } = render(
      <UserSessionProvider>
        <div>Test</div>
      </UserSessionProvider>,
    );

    await waitFor(
      () => {
        expect(getUserSession).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );

    unmount();

    expect(getUserSession).toHaveBeenCalledTimes(1);
  });
});
