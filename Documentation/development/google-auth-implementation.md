# Implémentation de l'authentification Google

## Vue d'ensemble

Cette implémentation ajoute l'authentification Google à l'application en utilisant Supabase Auth et respecte les meilleures pratiques de sécurité et d'UX.

## Architecture

### Composants créés

1. **`GoogleSignInButton`** (`src/client/components/GoogleSignInButton.tsx`)
   - Bouton réutilisable pour l'authentification Google
   - Gestion des états de chargement et d'erreur
   - Support des props personnalisables (variant, size, className, children)

2. **`AuthDivider`** (`src/client/components/AuthDivider.tsx`)
   - Composant de séparateur visuel entre les méthodes d'authentification
   - Texte personnalisable

3. **`useGoogleAuth`** (`src/client/hooks/useGoogleAuth.ts`)
   - Hook personnalisé pour gérer la logique d'authentification Google
   - Gestion des états (loading, error)
   - Configuration OAuth avec refresh token

### Routes créées

1. **`/auth/callback`** (`src/app/auth/callback/route.ts`)
   - Route de callback pour gérer le retour de l'authentification OAuth
   - Échange du code d'autorisation contre une session
   - Gestion des redirections sécurisées

2. **`/auth/auth-code-error`** (`src/app/auth/auth-code-error/page.tsx`)
   - Page d'erreur pour les échecs d'authentification
   - Interface utilisateur claire avec options de navigation

## Configuration requise

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Configuration Supabase

1. Activer le provider Google dans le dashboard Supabase
2. Configurer le Client ID et Client Secret Google
3. Ajouter l'URL de callback : `https://your-domain.com/auth/callback`

### Configuration Google Cloud

1. Créer un projet Google Cloud
2. Configurer l'écran de consentement OAuth
3. Créer des identifiants OAuth 2.0
4. Ajouter les domaines autorisés et URLs de redirection

## Utilisation

### Dans une page de connexion

```tsx
import { GoogleSignInButton, AuthDivider } from '@/client/components';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <h1>Se connecter</h1>

      <GoogleSignInButton />

      <AuthDivider />

      {/* Formulaire email/mot de passe */}
    </div>
  );
}
```

### Dans une page d'inscription

```tsx
import { GoogleSignInButton, AuthDivider } from '@/client/components';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <h1>Créer un compte</h1>

      <GoogleSignInButton>S'inscrire avec Google</GoogleSignInButton>

      <AuthDivider text="Ou s'inscrire avec email" />

      {/* Formulaire d'inscription */}
    </div>
  );
}
```

## Flux d'authentification

1. **Initiation** : L'utilisateur clique sur le bouton Google
2. **Redirection** : L'utilisateur est redirigé vers Google pour l'authentification
3. **Consentement** : L'utilisateur autorise l'application
4. **Callback** : Google redirige vers `/auth/callback` avec un code d'autorisation
5. **Échange** : Le code est échangé contre une session Supabase
6. **Redirection finale** : L'utilisateur est redirigé vers `/dashboard/profile`

## Sécurité

### Paramètres OAuth

- `access_type: 'offline'` : Permet d'obtenir un refresh token
- `prompt: 'consent'` : Force l'affichage de l'écran de consentement

### Gestion des erreurs

- Validation des URLs de redirection
- Gestion des erreurs de réseau
- Messages d'erreur utilisateur appropriés
- Logs d'erreur pour le débogage

### Protection CSRF

- Utilisation de nonces (optionnel, à implémenter si nécessaire)
- Validation des origines de redirection

## Tests

### Tests unitaires

- `GoogleSignInButton.spec.tsx` : Tests du composant bouton
- `useGoogleAuth.spec.tsx` : Tests du hook d'authentification

### Tests d'intégration

- Flux complet d'authentification
- Gestion des erreurs
- Redirections

## Personnalisation

### Styles

Le composant `GoogleSignInButton` utilise les classes Tailwind CSS et peut être personnalisé via les props :

```tsx
<GoogleSignInButton variant="default" size="lg" className="custom-styles">
  Texte personnalisé
</GoogleSignInButton>
```

### Configuration OAuth

Les paramètres OAuth peuvent être modifiés dans le hook `useGoogleAuth` :

```tsx
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
      // Paramètres supplémentaires
    },
  },
});
```

## Dépannage

### Erreurs courantes

1. **"redirect_uri_mismatch"**
   - Vérifier la configuration des URLs de redirection dans Google Cloud
   - S'assurer que l'URL de callback Supabase est correcte

2. **"invalid_client"**
   - Vérifier le Client ID et Client Secret dans Supabase
   - S'assurer que les identifiants correspondent au bon projet

3. **Erreurs de redirection**
   - Vérifier la configuration des domaines autorisés
   - Tester en mode développement et production

### Logs de débogage

Les erreurs sont loggées dans la console pour faciliter le débogage :

```javascript
console.error('Erreur de connexion Google:', error);
console.error('Erreur inattendue:', error);
```

## Maintenance

### Mises à jour

- Surveiller les changements dans l'API Google OAuth
- Maintenir les dépendances Supabase à jour
- Tester régulièrement le flux d'authentification

### Monitoring

- Surveiller les taux d'erreur d'authentification
- Analyser les logs d'erreur
- Tester les redirections en production
