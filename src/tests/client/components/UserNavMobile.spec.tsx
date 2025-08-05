import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserNavMobile } from '@/client/components/UserNavMobile';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
  };
});

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

vi.mock('lucide-react', () => ({
  Menu: ({ size }: { size?: number }) => (
    <div data-testid="menu-icon" data-size={size}>
      Menu
    </div>
  ),
  X: ({ size }: { size?: number }) => (
    <div data-testid="close-icon" data-size={size}>
      Close
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    size,
    variant,
    'aria-label': ariaLabel,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    size?: string;
    variant?: string;
    'aria-label'?: string;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      className={className}
      data-size={size}
      data-variant={variant}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('UserNavMobile', () => {
  const mockUser = {
    alteredAlias: 'TestUser',
    role: 'user' as const,
  };

  const mockAdminUser = {
    alteredAlias: 'AdminUser',
    role: 'admin' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render burger button initially', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    expect(burgerButton).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('should not render menu initially', () => {
    render(<UserNavMobile user={null} />);

    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
    expect(screen.queryByText('Statistiques')).not.toBeInTheDocument();
  });

  it('should open menu when burger button is clicked', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Statistiques')).toBeInTheDocument();
  });

  it('should render close button when menu is open', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    const closeButton = screen.getByRole('button', { name: 'Fermer le menu' });
    expect(closeButton).toBeInTheDocument();
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should close menu when close button is clicked', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    const closeButton = screen.getByRole('button', { name: 'Fermer le menu' });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
    expect(screen.queryByText('Statistiques')).not.toBeInTheDocument();
  });

  it('should render navigation links when menu is open', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: 'Accueil' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Statistiques' })).toBeInTheDocument();
  });

  it('should render login and register links when no user', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: 'Connexion' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inscription' })).toBeInTheDocument();
  });

  it('should render user profile link when user exists', () => {
    render(<UserNavMobile user={mockUser} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: mockUser.alteredAlias })).toBeInTheDocument();
  });

  it('should render admin link when user is admin', () => {
    render(<UserNavMobile user={mockAdminUser} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });

  it('should not render admin link when user is not admin', () => {
    render(<UserNavMobile user={mockUser} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('should close menu when navigation link is clicked', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    const homeLink = screen.getByRole('link', { name: 'Accueil' });
    fireEvent.click(homeLink);

    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
  });

  it('should have correct CSS classes for burger button', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    expect(burgerButton).toHaveClass(
      'fixed',
      'bottom-4',
      'right-4',
      'z-40',
      'bg-surface',
      'border-2',
      'border-primary',
      'text-primary',
      'hover:bg-primary',
      'hover:text-primary-foreground',
      'shadow-xl',
      'rounded-full',
      'w-14',
      'h-14',
      'transition-all',
      'duration-200',
      'hover:scale-105',
      'active:scale-95',
    );
  });

  it('should have correct CSS classes for menu overlay', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    const overlay = screen
      .getByText('Accueil')
      .closest('div[class*="fixed inset-0 z-50 bg-background"]');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-background', 'flex', 'flex-col');
  });

  it('should have correct CSS classes for navigation links', () => {
    render(<UserNavMobile user={null} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    const homeLink = screen.getByRole('link', { name: 'Accueil' });
    expect(homeLink).toHaveClass(
      'text-foreground',
      'transition-colors',
      'py-4',
      'px-6',
      'rounded-lg',
      'hover:bg-accent',
      'text-xl',
      'font-medium',
      'block',
    );
  });

  it('should handle user with long alias', () => {
    const longAliasUser = {
      alteredAlias: 'VeryLongUserAliasThatExceedsNormalLength',
      role: 'user' as const,
    };

    render(<UserNavMobile user={longAliasUser} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: longAliasUser.alteredAlias })).toBeInTheDocument();
  });

  it('should handle user with special characters in alias', () => {
    const specialAliasUser = {
      alteredAlias: 'User@123!',
      role: 'user' as const,
    };

    render(<UserNavMobile user={specialAliasUser} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: specialAliasUser.alteredAlias })).toBeInTheDocument();
  });

  it('should handle user with empty alias', () => {
    const emptyAliasUser = {
      alteredAlias: '',
      role: 'user' as const,
    };

    render(<UserNavMobile user={emptyAliasUser} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: '' })).toBeInTheDocument();
  });

  it('should handle user with null alias', () => {
    const nullAliasUser = {
      alteredAlias: undefined as unknown as string,
      role: 'user' as const,
    };

    render(<UserNavMobile user={nullAliasUser} />);

    const burgerButton = screen.getByRole('button', { name: 'Menu mobile' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('link', { name: '' })).toBeInTheDocument();
  });
});
