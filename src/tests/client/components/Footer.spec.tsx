import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from '@/client/components/Footer';

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

describe('Footer', () => {
  it('should render copyright text', () => {
    render(<Footer />);

    expect(screen.getByText('© 2025 Altered Arena Stats')).toBeInTheDocument();
  });

  it('should render disclaimer text', () => {
    render(<Footer />);

    expect(
      screen.getByText(
        "Altered Arena Stats est un projet non officiel, indépendant des éditeurs ou ayants droit d'Altered.",
      ),
    ).toBeInTheDocument();
  });

  it('should render legal links', () => {
    render(<Footer />);

    const mentionsLink = screen.getByRole('link', { name: 'Mentions légales' });
    const privacyLink = screen.getByRole('link', { name: 'Politique de confidentialité' });

    expect(mentionsLink).toBeInTheDocument();
    expect(mentionsLink).toHaveAttribute('href', '/legal/mentions');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy');
  });

  it('should render only legal links', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    const mentionsLink = screen.getByRole('link', { name: 'Mentions légales' });
    const privacyLink = screen.getByRole('link', { name: 'Politique de confidentialité' });

    expect(mentionsLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(
      'text-xs',
      'text-muted-foreground',
      'text-center',
      'py-6',
      'border-t',
      'mt-12',
      'space-y-3',
      'px-4',
    );
  });

  it('should render all links with hover underline class', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('hover:underline');
    });
  });
});
