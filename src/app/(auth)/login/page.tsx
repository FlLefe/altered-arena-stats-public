'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleSignInButton, AuthDivider } from '@/client/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/browserClient';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        // After successful login, check profile status
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Check if user profile is complete
          const { data: player, error: playerError } = await supabase
            .from('Player')
            .select('profileComplete')
            .eq('authId', user.id)
            .is('deletedAt', null)
            .single();

          if (playerError || !player || !player.profileComplete) {
            router.push('/onboarding');
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      }
    });
  };

  return (
    <div className="max-w-sm mx-auto mt-8 px-4 space-y-6">
      <h1 className="text-xl font-bold text-center">Se connecter</h1>

      <GoogleSignInButton />

      <AuthDivider />

      {/* Email/Password Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-error-foreground text-sm bg-error p-3 rounded-md border border-error">
            {error}
          </p>
        )}

        <div className="flex justify-center">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Connexion...' : 'Se connecter'}
          </Button>
        </div>
      </form>

      <p className="text-sm text-muted-foreground text-center">
        Pas encore de compte ?
        <a href="/register" className="text-primary hover:underline ml-1">
          Inscrivez-vous
        </a>
      </p>
    </div>
  );
}
