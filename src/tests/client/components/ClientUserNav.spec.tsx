import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClientUserNav } from '@/client/components/ClientUserNav';
import { useUserSession } from '@/client/features/session/useSession';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/client/features/session/useSession', () => ({
  useUserSession: vi.fn(),
}));

vi.mock('@/server/components', () => ({
  UserNavDesktop: ({ alteredAlias, isAdmin }: { alteredAlias: string; isAdmin: boolean }) => (
    <div data-testid="user-nav-desktop">
      Desktop Nav - {alteredAlias} - Admin: {isAdmin.toString()}
    </div>
  ),
}));

// Mock UserNavMobile
vi.mock('@/client/components/UserNavMobile', () => ({
  UserNavMobile: ({
    user,
    ...props
  }: {
    user: { alteredAlias: string; role: string } | null;
    [key: string]: unknown;
  }) => (
    <div data-testid="user-nav-mobile" {...props}>
      {user ? `User: ${user.alteredAlias}` : 'No user'}
      <button>Logout</button>
    </div>
  ),
}));

describe('ClientUserNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mobile variant', () => {
    it('should render UserNavMobile when variant is mobile', () => {
      (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

      render(<ClientUserNav variant="mobile" />);

      expect(screen.getByTestId('client-user-nav-mobile')).toBeInTheDocument();
    });

    it('should pass user to UserNavMobile', () => {
      const mockUser = { alteredAlias: 'TestUser', role: 'user' as const };
      (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });

      render(<ClientUserNav variant="mobile" />);

      expect(screen.getByText('User: TestUser')).toBeInTheDocument();
    });

    it('should pass null user to UserNavMobile when no user', () => {
      (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

      render(<ClientUserNav variant="mobile" />);

      expect(screen.getByText('No user')).toBeInTheDocument();
    });
  });

  describe('desktop variant', () => {
    it('should render login and register links when no user', () => {
      (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

      render(<ClientUserNav variant="desktop" />);

      const loginLink = screen.getByRole('link', { name: 'Connexion' });
      const registerLink = screen.getByRole('link', { name: 'Inscription' });

      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('should render UserNavDesktop when user exists', () => {
      const mockUser = { alteredAlias: 'TestUser', role: 'user' as const };
      (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });

      render(<ClientUserNav variant="desktop" />);

      expect(screen.getByTestId('user-nav-desktop')).toBeInTheDocument();
      expect(screen.getByText('Desktop Nav - TestUser - Admin: false')).toBeInTheDocument();
    });

    it('should pass correct props to UserNavDesktop for admin user', () => {
      const mockUser = { alteredAlias: 'AdminUser', role: 'admin' as const };
      (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });

      render(<ClientUserNav variant="desktop" />);

      expect(screen.getByText('Desktop Nav - AdminUser - Admin: true')).toBeInTheDocument();
    });

    it('should pass correct props to UserNavDesktop for regular user', () => {
      const mockUser = { alteredAlias: 'RegularUser', role: 'user' as const };
      (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });

      render(<ClientUserNav variant="desktop" />);

      expect(screen.getByText('Desktop Nav - RegularUser - Admin: false')).toBeInTheDocument();
    });
  });

  it('should have correct CSS classes for login/register links', () => {
    (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

    render(<ClientUserNav variant="desktop" />);

    const loginLink = screen.getByRole('link', { name: 'Connexion' });
    const registerLink = screen.getByRole('link', { name: 'Inscription' });

    expect(loginLink).toHaveClass('hover:underline');
    expect(registerLink).toHaveClass('hover:underline');
  });

  it('should have correct container classes for login/register links', () => {
    (useUserSession as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

    render(<ClientUserNav variant="desktop" />);

    const container = screen.getByRole('link', { name: 'Connexion' }).parentElement;
    expect(container).toHaveClass('flex', 'gap-4');
  });
});
