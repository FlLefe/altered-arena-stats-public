'use client';

import React, { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { PasswordStrengthIndicator, GoogleSignInButton, AuthDivider } from '@/client/components';
import { useErrorHandler, usePasswordValidation } from '@/client/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/server/features';

export function RegisterForm() {
  const router = useRouter();
  const { handleError, handleSuccess } = useErrorHandler();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isPending, startTransition] = useTransition();

  // Real-time password validation
  const passwordValidation = usePasswordValidation(formData.password, formData.confirmPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation before submission
    if (!passwordValidation.isValid) {
      handleError(passwordValidation.error || 'Mot de passe invalide');
      return;
    }

    startTransition(async () => {
      try {
        const result = await registerUser(formData);

        if (result.success) {
          handleSuccess(result.data?.message || 'Compte créé avec succès !');

          router.push('/login');
        } else {
          handleError(result.error || "Une erreur s'est produite");
        }
      } catch {
        handleError("Une erreur inattendue s'est produite");
      }
    });
  };

  const getPasswordStatusIcon = () => {
    if (passwordValidation.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (passwordValidation.error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
        <p className="text-muted-foreground">
          Rejoignez la communauté Altered pour suivre vos performances
        </p>
      </div>

      {/* Google Sign In Button */}
      <div className="mb-6">
        <GoogleSignInButton>S&apos;inscrire avec Google</GoogleSignInButton>
      </div>

      {/* Divider */}
      <AuthDivider text="Ou s'inscrire avec email" className="mb-6" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {getPasswordStatusIcon() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getPasswordStatusIcon()}
              </div>
            )}
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-3">
              <PasswordStrengthIndicator
                strength={passwordValidation.strength}
                checks={passwordValidation.checks}
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" disabled={isPending || !passwordValidation.isValid}>
            {isPending ? 'Chargement...' : 'Créer mon compte'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Déjà un compte ?{' '}
            <a href="/login" className="text-primary hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
