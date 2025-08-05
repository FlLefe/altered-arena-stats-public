import '@testing-library/jest-dom';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect, vi, beforeEach, afterEach } from 'vitest';

// Configuration de Chai
chai.use(chaiAsPromised);

// Exposer Chai globalement pour les tests
(global as Record<string, unknown>).expect = expect;
(global as Record<string, unknown>).chai = chai;

// Configuration pour gérer les erreurs non gérées
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  // Supprimer les erreurs console pendant les tests
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  // Restaurer les fonctions originales
  console.error = originalError;
  console.warn = originalWarn;
});

// Gérer les promesses rejetées non gérées
process.on('unhandledRejection', (reason) => {
  // Ignorer les erreurs de promesses rejetées dans les tests
  // car elles sont souvent intentionnelles pour tester la gestion d'erreur
  console.warn('Unhandled Rejection:', reason);
});

// Gérer les erreurs non gérées
process.on('uncaughtException', (error) => {
  // Ignorer les erreurs non gérées dans les tests
  // car elles sont souvent intentionnelles pour tester la gestion d'erreur
  console.warn('Uncaught Exception:', error);
});
