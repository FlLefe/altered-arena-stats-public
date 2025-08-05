import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterForm } from '@/client/features/auth/RegisterForm';
import { registerUser } from '@/server/features/auth/registerUser';

// Mock of validation hooks
vi.mock('@/client/hooks', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
    handleSuccess: vi.fn(),
  }),
  usePasswordValidation: () => ({
    isValid: true,
    error: null,
    isMatching: true,
    strength: 'strong' as const,
    checks: {
      length: true,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
      noCommon: true,
    },
  }),
  useGoogleAuth: () => ({
    signInWithGoogle: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock of registerUser
vi.mock('@/server/features/auth/registerUser', () => ({
  registerUser: vi.fn(),
}));

// Mock of useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock of UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: React.ComponentProps<'input'>) => <input {...props} data-testid="input" />,
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: React.ComponentProps<'label'>) => (
    <label {...props} data-testid="label">
      {children}
    </label>
  ),
}));

// Mock of client components
vi.mock('@/client/components', () => ({
  GoogleSignInButton: ({ children }: { children?: React.ReactNode }) => (
    <button data-testid="google-signin-button">{children}</button>
  ),
  AuthDivider: ({ text, className }: { text?: string; className?: string }) => (
    <div data-testid="auth-divider" className={className}>
      {text}
    </div>
  ),
  PasswordStrengthIndicator: ({ strength }: { strength?: string; checks?: unknown }) => (
    <div data-testid="password-strength-indicator">Strength: {strength}</div>
  ),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with email and password fields', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer mon compte' })).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('votre@email.com');
    const passwordInput = screen.getByLabelText('Mot de passe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle successful form submission with email confirmation required', async () => {
    (registerUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: {
        emailConfirmed: false,
        message: 'Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.',
      },
    });

    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('votre@email.com');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: 'Créer mon compte' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle successful form submission with email already confirmed', async () => {
    (registerUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: {
        emailConfirmed: true,
        message: 'Compte créé avec succès ! Vous pouvez vous connecter.',
      },
    });

    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('votre@email.com');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: 'Créer mon compte' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle form submission error', async () => {
    (registerUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      error: 'Email déjà utilisé',
    });

    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('votre@email.com');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: 'Créer mon compte' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  it('should show loading state during submission', async () => {
    (registerUser as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));

    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('votre@email.com');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: 'Créer mon compte' });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('should have required fields', () => {
    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('votre@email.com');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(confirmPasswordInput).toBeRequired();
  });

  it('should have link to login page', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Se connecter')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute('href', '/login');
  });
});
