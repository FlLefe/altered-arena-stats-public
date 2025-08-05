import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OnboardingForm } from '@/client/features/onboarding/OnboardingForm';
import { completeOnboardingAction } from '@/server/features/player/completeOnboardingAction';

// Mock of validation hooks
vi.mock('@/client/hooks', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
    handleSuccess: vi.fn(),
  }),
  useAliasValidation: () => ({
    isValid: true,
    isChecking: false,
    error: null,
    isAvailable: true,
  }),
}));

// Mock of completeOnboardingAction
vi.mock('@/server/features/player/completeOnboardingAction', () => ({
  completeOnboardingAction: vi.fn(),
}));

// Mock of useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockFactions = [
  {
    id: '1',
    name: 'Faction 1',
    colorCode: '#ff0000',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Faction 2',
    colorCode: '#00ff00',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
];

const mockHeroes = [
  {
    id: '1',
    name: 'Hero 1',
    imageUrl: null,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    faction: {
      id: '1',
      name: 'Faction 1',
      colorCode: '#ff0000',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
  },
  {
    id: '2',
    name: 'Hero 2',
    imageUrl: null,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    faction: {
      id: '2',
      name: 'Faction 2',
      colorCode: '#00ff00',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
  },
];

describe('OnboardingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with all fields', () => {
    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    expect(screen.getByText('Configuration de votre profil')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex : Pseudo_1234')).toBeInTheDocument();
    expect(screen.getByText('Faction de cœur (optionnelle)')).toBeInTheDocument();
    expect(screen.getByText('Héros préféré (optionnel)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Compléter le profil' })).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    const aliasInput = screen.getByPlaceholderText('Ex : Pseudo_1234');

    fireEvent.change(aliasInput, { target: { value: 'TestUser' } });

    expect(aliasInput).toHaveValue('TestUser');
  });

  it('should handle successful form submission', async () => {
    (completeOnboardingAction as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });

    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    const aliasInput = screen.getByPlaceholderText('Ex : Pseudo_1234');

    fireEvent.change(aliasInput, { target: { value: 'TestUser' } });

    const submitButton = screen.getByRole('button', { name: 'Compléter le profil' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(completeOnboardingAction).toHaveBeenCalledWith({
        data: {
          alteredAlias: 'TestUser',
          favoriteFactionId: '',
          favoriteHeroId: '',
        },
      });
    });
  });

  it('should handle form submission error', async () => {
    (completeOnboardingAction as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Submission failed'),
    );

    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    const aliasInput = screen.getByPlaceholderText('Ex : Pseudo_1234');

    fireEvent.change(aliasInput, { target: { value: 'TestUser' } });

    const submitButton = screen.getByRole('button', { name: 'Compléter le profil' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(completeOnboardingAction).toHaveBeenCalledWith({
        data: {
          alteredAlias: 'TestUser',
          favoriteFactionId: '',
          favoriteHeroId: '',
        },
      });
    });
  });

  it('should show loading state during submission', async () => {
    (completeOnboardingAction as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    const aliasInput = screen.getByPlaceholderText('Ex : Pseudo_1234');

    fireEvent.change(aliasInput, { target: { value: 'TestUser' } });

    const submitButton = screen.getByRole('button', { name: 'Compléter le profil' });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Configuration...')).toBeInTheDocument();
  });

  it('should have required alias field', () => {
    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    const aliasInput = screen.getByPlaceholderText('Ex : Pseudo_1234');

    expect(aliasInput).toBeRequired();
  });

  it('should show pseudo validation rules', () => {
    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    expect(
      screen.getByText('3-20 caractères, lettres, chiffres, tirets et underscores uniquement'),
    ).toBeInTheDocument();
  });

  it('should show pseudo is required', () => {
    render(<OnboardingForm factions={mockFactions} heroes={mockHeroes} />);

    expect(screen.getByText('Pseudo Altered *')).toBeInTheDocument();
  });
});
