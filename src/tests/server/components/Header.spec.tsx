import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/server/components/Header';

// Mock React
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
  };
});

// Mock Radix UI components
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="dropdown-trigger" {...props}>
      {children}
    </div>
  ),
  DropdownMenuContent: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="dropdown-content" {...props}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="dropdown-item" {...props}>
      {children}
    </div>
  ),
  DropdownMenuSeparator: ({ ...props }: { [key: string]: unknown }) => (
    <div data-testid="dropdown-separator" {...props} />
  ),
}));

// Mock Next.js Link
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

vi.mock('@/client/components', () => ({
  ClientUserNav: ({ variant }: { variant?: string }) => (
    <div data-testid="client-user-nav" data-variant={variant}>
      ClientUserNav
    </div>
  ),
  NavigationLinks: () => (
    <div data-testid="navigation-links">
      <a href="/stats">Statistiques</a>
    </div>
  ),
  LogoutButton: ({ onLogout }: { onLogout: () => void }) => (
    <button onClick={onLogout} data-testid="logout-button">
      Logout
    </button>
  ),
}));

describe('Header', () => {
  it('should render desktop header with correct structure', () => {
    render(<Header />);

    const headers = screen.getAllByRole('banner');
    const desktopHeader = headers.find(
      (header) => header.classList.contains('hidden') && header.classList.contains('md:block'),
    );
    expect(desktopHeader).toBeInTheDocument();
    expect(desktopHeader).toHaveClass(
      'hidden',
      'md:block',
      'w-full',
      'border-b',
      'border-header-border',
      'bg-header',
      'shadow-sm',
    );
  });

  it('should render logo link', () => {
    render(<Header />);

    const logoLinks = screen.getAllByRole('link', { name: /Altered Arena Stats/ });
    const desktopLogoLink = logoLinks.find((link) => link.classList.contains('text-xl'));
    expect(desktopLogoLink).toBeInTheDocument();
    expect(desktopLogoLink).toHaveAttribute('href', '/');
    expect(desktopLogoLink).toHaveClass(
      'text-xl',
      'font-bold',
      'text-primary',
      'hover:opacity-80',
      'transition',
    );
  });

  it('should render navigation links', () => {
    render(<Header />);

    const statsLink = screen.getByRole('link', { name: 'Statistiques' });
    expect(statsLink).toBeInTheDocument();
    expect(statsLink).toHaveAttribute('href', '/stats');
  });

  it('should render desktop navigation container', () => {
    render(<Header />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('flex', 'gap-4', 'items-center', 'text-sm', 'font-medium');
  });

  it('should render desktop ClientUserNav', () => {
    render(<Header />);

    const navs = screen.getAllByTestId('client-user-nav');
    const desktopNav = navs.find((nav) => nav.getAttribute('data-variant') === 'desktop');
    expect(desktopNav).toBeInTheDocument();
    expect(desktopNav).toHaveAttribute('data-variant', 'desktop');
  });

  it('should render mobile ClientUserNav', () => {
    render(<Header />);

    const navs = screen.getAllByTestId('client-user-nav');
    const mobileNav = navs.find((nav) => nav.getAttribute('data-variant') === 'mobile');
    expect(mobileNav).toBeInTheDocument();
    expect(mobileNav).toHaveAttribute('data-variant', 'mobile');
  });

  it('should have correct container classes', () => {
    render(<Header />);

    const headers = screen.getAllByRole('banner');
    const desktopHeader = headers.find(
      (header) => header.classList.contains('hidden') && header.classList.contains('md:block'),
    );
    const container = desktopHeader?.querySelector('div');
    expect(container).toHaveClass(
      'max-w-5xl',
      'mx-auto',
      'px-4',
      'py-3',
      'flex',
      'justify-between',
      'items-center',
    );
  });

  it('should have mobile-only container', () => {
    render(<Header />);

    const navs = screen.getAllByTestId('client-user-nav');
    const mobileNav = navs.find((nav) => nav.getAttribute('data-variant') === 'mobile');
    const mobileContainer = mobileNav?.parentElement;
    expect(mobileContainer).toHaveClass('md:hidden');
  });

  it('should render both desktop and mobile navigation', () => {
    render(<Header />);

    // Desktop navigation
    const headers = screen.getAllByRole('banner');
    expect(headers).toHaveLength(1);

    const navs = screen.getAllByTestId('client-user-nav');
    const desktopNav = navs.find((nav) => nav.getAttribute('data-variant') === 'desktop');
    expect(desktopNav).toHaveAttribute('data-variant', 'desktop');

    // Mobile navigation
    const mobileNav = navs.find((nav) => nav.getAttribute('data-variant') === 'mobile');
    expect(mobileNav).toHaveAttribute('data-variant', 'mobile');
  });
});
