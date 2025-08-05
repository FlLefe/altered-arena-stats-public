import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserNavDesktop } from '@/server/components/UserNavDesktop';

// Mock React
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
  };
});

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

describe('UserNavDesktop', () => {
  it('should render user profile link', () => {
    render(<UserNavDesktop alteredAlias="TestUser" isAdmin={false} />);

    const profileLink = screen.getByRole('link', { name: 'TestUser' });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/dashboard/profile');
    expect(profileLink).toHaveClass('hover:underline');
  });

  it('should render admin link when user is admin', () => {
    render(<UserNavDesktop alteredAlias="AdminUser" isAdmin={true} />);

    const adminLink = screen.getByRole('link', { name: 'Admin' });
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute('href', '/admin');
    expect(adminLink).toHaveClass('hover:underline');
  });

  it('should not render admin link when user is not admin', () => {
    render(<UserNavDesktop alteredAlias="RegularUser" isAdmin={false} />);

    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('should render both admin and profile links for admin user', () => {
    render(<UserNavDesktop alteredAlias="AdminUser" isAdmin={true} />);

    const adminLink = screen.getByRole('link', { name: 'Admin' });
    const profileLink = screen.getByRole('link', { name: 'AdminUser' });

    expect(adminLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
  });

  it('should render only profile link for regular user', () => {
    render(<UserNavDesktop alteredAlias="RegularUser" isAdmin={false} />);

    const profileLink = screen.getByRole('link', { name: 'RegularUser' });
    expect(profileLink).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('should have correct CSS classes for all links', () => {
    render(<UserNavDesktop alteredAlias="TestUser" isAdmin={true} />);

    const adminLink = screen.getByRole('link', { name: 'Admin' });
    const profileLink = screen.getByRole('link', { name: 'TestUser' });

    expect(adminLink).toHaveClass('hover:underline');
    expect(profileLink).toHaveClass('hover:underline');
  });

  it('should handle empty alteredAlias', () => {
    render(<UserNavDesktop alteredAlias="" isAdmin={false} />);

    const profileLink = screen.getByRole('link', { name: '' });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/dashboard/profile');
  });

  it('should handle special characters in alteredAlias', () => {
    render(<UserNavDesktop alteredAlias="User@123" isAdmin={false} />);

    const profileLink = screen.getByRole('link', { name: 'User@123' });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/dashboard/profile');
  });
});
