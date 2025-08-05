# Système de Gestion d'Erreurs

Ce document explique comment utiliser le nouveau système de gestion d'erreurs centralisé.

## 🎯 Vue d'ensemble

Le système d'erreurs est composé de :

- **Types d'erreurs typés** avec des codes spécifiques
- **Classes d'erreurs** pour différents domaines
- **Utilitaires de validation** avec Zod
- **Hook client** pour gérer les erreurs côté frontend
- **Logging automatique** des erreurs

## 📁 Structure des fichiers

```
src/lib/
├── errors.ts          # Types et classes d'erreurs
├── validation.ts      # Utilitaires de validation
├── withResult.ts      # Wrappers pour la gestion d'erreurs
├── result.ts          # Pattern Result<T>
└── index.ts           # Exports publics
```

## 🔧 Utilisation côté Serveur

### 1. Dans les Server Actions

```typescript
import { createError } from '@/lib/errors';
import { validateWithZodResult, validateAuthentication } from '@/lib/validation';

export async function myServerAction(data: unknown) {
  try {
    // Validation de l'authentification
    const session = await getFullUserSession();
    validateAuthentication(session, 'myServerAction');

    // Validation des données
    const validationResult = validateWithZodResult(MySchema, data, 'myServerAction');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    // Logique métier
    const result = await myRepositoryFunction(validationResult.data);

    if (result.type === 'failure') {
      return { success: false, error: result.reason, code: 'DATABASE_ERROR' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[myServerAction]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
```

### 2. Dans les Repositories

```typescript
import { withDatabaseResult } from '@/lib/withResult';

export const myRepositoryFunction = (data: MyData) => {
  return withDatabaseResult(() => db.myTable.create({ data }), 'myRepositoryFunction');
};
```

### 3. Validation avec Zod

```typescript
import { validateWithZod } from '@/lib/validation';

// Lève une ValidationError si invalide
const validatedData = validateWithZod(MySchema, data, 'context');

// Retourne un Result
const result = validateWithZodResult(MySchema, data, 'context');
```

## 🎨 Utilisation côté Client

### 1. Hook useErrorHandler

```typescript
import { useErrorHandler } from '@/client/hooks/useErrorHandler';

export function MyComponent() {
  const { handleError, handleSuccess } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      const result = await myServerAction(data);

      if (!result.success) {
        handleError(result.error || "Une erreur s'est produite");
        return;
      }

      handleSuccess('Opération réussie !');
    } catch (error) {
      handleError("Une erreur inattendue s'est produite");
    }
  };
}
```

### 2. Types de réponses

```typescript
import { ServerResponse, isServerError, extractData } from '@/client/hooks/useErrorHandler';

const result: ServerResponse<MyData> = await myServerAction(data);

if (isServerError(result)) {
  // result est de type ServerErrorResponse
  console.log(result.error, result.code);
} else {
  // result est de type ServerSuccessResponse<MyData>
  const data = extractData(result);
}
```

## 🏷️ Codes d'erreur disponibles

### Authentification

- `UNAUTHORIZED` - Utilisateur non authentifié
- `FORBIDDEN` - Accès refusé
- `INVALID_CREDENTIALS` - Identifiants invalides
- `SESSION_EXPIRED` - Session expirée

### Validation

- `VALIDATION_ERROR` - Erreur de validation Zod
- `INVALID_INPUT` - Données d'entrée invalides
- `MISSING_REQUIRED_FIELD` - Champ requis manquant

### Ressources

- `RESOURCE_NOT_FOUND` - Ressource introuvable
- `RESOURCE_ALREADY_EXISTS` - Ressource déjà existante
- `RESOURCE_CONFLICT` - Conflit de ressources

### Métier

- `MAX_MATCHES_REACHED` - Nombre maximum de matchs atteint
- `MATCH_ALREADY_COMPLETED` - Match déjà terminé
- `INVALID_MATCH_STATE` - État de match invalide
- `ALIAS_ALREADY_TAKEN` - Alias déjà pris

### Base de données

- `DATABASE_ERROR` - Erreur de base de données
- `CONSTRAINT_VIOLATION` - Violation de contrainte
- `CONNECTION_ERROR` - Erreur de connexion

### Externes

- `EXTERNAL_SERVICE_ERROR` - Erreur service externe
- `SUPABASE_ERROR` - Erreur Supabase

### Génériques

- `INTERNAL_ERROR` - Erreur interne
- `UNKNOWN_ERROR` - Erreur inconnue

## 🔍 Logging automatique

Toutes les erreurs sont automatiquement loggées avec :

- Nom de l'erreur
- Message
- Stack trace
- Contexte
- Timestamp
- Code d'erreur (pour les ApplicationError)

## 🎯 Bonnes pratiques

1. **Toujours utiliser les codes d'erreur appropriés**
2. **Fournir des messages d'erreur clairs pour l'utilisateur**
3. **Logger les erreurs avec le contexte approprié**
4. **Gérer les erreurs côté client avec useErrorHandler**
5. **Utiliser validateWithZodResult pour la validation**
6. **Retourner des réponses typées { success, error?, data?, code? }**

## 🚀 Migration

Pour migrer un Server Action existant :

1. Remplacer `z.safeParse()` par `validateWithZodResult()`
2. Ajouter des codes d'erreur appropriés
3. Utiliser `withDatabaseResult()` dans les repositories
