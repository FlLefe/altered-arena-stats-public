# Configuration de l'authentification Google

## Prérequis

1. Un projet Google Cloud Platform
2. Un projet Supabase configuré

## Configuration Google Cloud Platform

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant

### 2. Configurer l'écran de consentement

1. Dans la console Google Cloud, allez à **APIs & Services** > **OAuth consent screen**
2. Configurez l'écran de consentement selon vos besoins
3. Sous **Authorized domains**, ajoutez le domaine de votre projet Supabase : `<PROJECT_ID>.supabase.co`
4. Configurez les scopes non-sensibles :
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`

### 3. Créer les identifiants OAuth

1. Allez à **APIs & Services** > **Credentials**
2. Cliquez sur **Create credentials** > **OAuth Client ID**
3. Choisissez **Web application** comme type d'application
4. Sous **Authorized JavaScript origins**, ajoutez :
   - `http://localhost:3000` (pour le développement)
   - Votre URL de production
5. Sous **Authorized redirect URLs**, ajoutez l'URL de callback de Supabase (visible dans le dashboard Supabase)

### 4. Récupérer les identifiants

Notez votre **Client ID** et **Client Secret** - vous en aurez besoin pour la configuration Supabase.

## Configuration Supabase

### 1. Activer le provider Google

1. Dans votre dashboard Supabase, allez à **Authentication** > **Providers**
2. Trouvez **Google** et activez-le
3. Ajoutez votre **Client ID** et **Client Secret** Google

### 2. Variables d'environnement

Assurez-vous que vos variables d'environnement sont configurées :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Test de l'authentification

1. Démarrez votre application en mode développement
2. Allez sur `/login` ou `/register`
3. Cliquez sur le bouton "Continuer avec Google"
4. Vous devriez être redirigé vers Google pour l'authentification
5. Après authentification, vous serez redirigé vers `/dashboard/profile`

## Dépannage

### Erreur "redirect_uri_mismatch"

- Vérifiez que l'URL de callback dans Google Cloud correspond exactement à celle de Supabase
- Assurez-vous que les URLs autorisées incluent votre domaine de développement

### Erreur "invalid_client"

- Vérifiez que le Client ID et Client Secret sont correctement configurés dans Supabase
- Assurez-vous que les identifiants correspondent au bon projet Google Cloud

### Problèmes de redirection

- Vérifiez que la route `/auth/callback` est correctement configurée
- Assurez-vous que les cookies sont correctement gérés en production

## Sécurité

- Ne partagez jamais vos Client Secret
- Utilisez des variables d'environnement pour stocker les identifiants sensibles
- Configurez des domaines autorisés appropriés pour limiter l'accès
- Activez la vérification en deux étapes sur votre compte Google Cloud
