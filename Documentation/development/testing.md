# Tests - Altered Stats Arena

Ce dossier contient tous les tests unitaires de l'application.

## Structure

```
src/tests/
├── client/
│   ├── components/          # Tests des composants React
│   │   └── SearchInput.spec.tsx
│   └── hooks/              # Tests des hooks personnalisés
│       ├── useDebounce.spec.tsx
│       ├── useFactions.spec.tsx
│       ├── useSeasons.spec.tsx
│       └── usePaginatedData.spec.tsx
├── utils/                  # Tests des utilitaires
│   ├── date.spec.ts
│   ├── validation.spec.ts
│   └── retry.spec.ts
└── README.md
```

## Configuration

### Vitest

- **Framework de test** : Vitest
- **Assertions** : Vitest + Chai
- **Environnement** : jsdom pour les tests React
- **Setup** : `vitest.setup.ts` avec configuration de Chai

### Scripts disponibles

```bash
# Lancer les tests en mode watch
npm test

# Lancer les tests une seule fois
npm run test:run

# Générer un rapport de couverture
npm run test:coverage

# Interface graphique pour les tests
npm run test:ui

# Mode watch pour le développement
npm run test:watch
```

## Conventions

### Nommage des fichiers

- Les fichiers de test doivent se terminer par `.spec.ts` ou `.spec.tsx`
- Un fichier de test par module testé
- Structure : `[nom-du-module].spec.[ext]`

### Structure des tests

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('NomDuModule', () => {
  beforeEach(() => {
    // Setup avant chaque test
  });

  afterEach(() => {
    // Cleanup après chaque test
  });

  describe('NomDeLaFonction', () => {
    it('should do something when condition', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Mocks

- Utiliser `vi.mock()` pour mocker les modules externes
- Utiliser `vi.fn()` pour créer des fonctions mockées
- Utiliser `vi.useFakeTimers()` pour les tests de timing

### Assertions

- Utiliser les assertions Vitest : `expect().toBe()`, `expect().toEqual()`, etc.
- Utiliser Chai pour des assertions plus expressives si nécessaire
- Tester les cas positifs ET négatifs

## Types de tests

### Tests unitaires

- **Utilitaires** : Fonctions pures, logique métier
- **Hooks** : Logique React, gestion d'état
- **Composants** : Rendu, interactions utilisateur

### Bonnes pratiques

1. **Isolation** : Chaque test doit être indépendant
2. **Clarté** : Noms de tests descriptifs
3. **Couverture** : Tester les cas d'erreur et les cas limites
4. **Performance** : Tests rapides et efficaces
5. **Maintenabilité** : Code de test lisible et bien structuré

## Exemples

### Test d'utilitaire

```typescript
import { describe, it, expect } from 'vitest';
import { parseDateString } from '@/utils/date';

describe('Date Utils', () => {
  describe('parseDateString', () => {
    it('should parse a valid date string', () => {
      const result = parseDateString('2024-01-15');
      expect(result).toBeInstanceOf(Date);
    });

    it('should return null for invalid date', () => {
      const result = parseDateString('invalid');
      expect(result).toBeNull();
    });
  });
});
```

### Test de hook

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFactions } from '@/client/hooks/useFactions';

vi.mock('@/server/features', () => ({
  getAllFactionsAction: vi.fn(),
}));

describe('useFactions', () => {
  it('should fetch factions successfully', async () => {
    // Test implementation
  });
});
```

### Test de composant

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from '@/client/components/SearchInput';

describe('SearchInput', () => {
  it('should call onChange with debounced value', async () => {
    // Test implementation
  });
});
```

## Couverture de code

La couverture de code est générée avec `npm run test:coverage` et inclut :

- **Statements** : Pourcentage de lignes exécutées
- **Branches** : Pourcentage de branches conditionnelles testées
- **Functions** : Pourcentage de fonctions appelées
- **Lines** : Pourcentage de lignes couvertes

Objectif : Maintenir une couverture > 80% pour les modules critiques.
