import { vi } from 'vitest';

/**
 * Helper pour gérer les erreurs de promesses rejetées dans les tests
 * @param testFn - La fonction de test à exécuter
 */
export const withErrorHandling = async (testFn: () => Promise<void> | void) => {
  const originalError = console.error;
  const originalWarn = console.warn;

  // Supprimer les logs d'erreur pendant le test
  console.error = vi.fn();
  console.warn = vi.fn();

  try {
    await testFn();
  } finally {
    // Restaurer les fonctions originales
    console.error = originalError;
    console.warn = originalWarn;
  }
};

/**
 * Helper pour créer un mock de startTransition qui gère les erreurs
 */
export const createSafeStartTransition = () => {
  return vi.fn((callback) => {
    Promise.resolve().then(() => {
      try {
        callback();
      } catch {
        // Capturer les erreurs pour éviter les "Unhandled Rejection"
        // Ne pas faire remonter l'erreur car c'est le comportement attendu dans les tests
      }
    });
  });
};

/**
 * Helper pour configurer un mock de React avec useTransition sécurisé
 */
export const createSafeReactMock = () => {
  return {
    useTransition: () => {
      const startTransition = createSafeStartTransition();
      return [false, startTransition];
    },
    startTransition: createSafeStartTransition(),
  };
};
