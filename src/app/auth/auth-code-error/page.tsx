import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Erreur d&apos;authentification</h1>
          <p className="text-muted-foreground">
            Une erreur s&apos;est produite lors de la connexion avec Google. Veuillez réessayer ou
            utiliser une autre méthode de connexion.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Retour à la connexion</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/register">Créer un compte</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Si le problème persiste, contactez le support.
        </p>
      </div>
    </div>
  );
}
