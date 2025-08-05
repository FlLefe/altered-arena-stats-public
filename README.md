# Altered Stats Arena

Application web pour le suivi des statistiques du jeu de cartes Altered TCG.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev

# Ouverture dans le navigateur
# http://localhost:3000
```

## 📚 Documentation

La documentation complète du projet est organisée dans le dossier [`Documentation/`](./Documentation/README.md) :

- **🎨 Design** : [Système de design](./Documentation/design/design-system.md)
- **💻 Développement** :
  - [Gestion d'erreurs](./Documentation/development/error-handling.md)
  - [Tests unitaires](./Documentation/development/testing.md)
- **🔌 API** : Documentation des endpoints (à venir)
- **🏗️ Architecture** : Architecture générale (à venir)

## 🛠️ Technologies utilisées

- **Framework** : Next.js 14 avec App Router
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **UI** : ShadCN/UI + Tailwind CSS
- **Tests** : Vitest + Testing Library
- **Validation** : Zod
- **TypeScript** : Typage strict

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
├── client/                 # Code côté client
│   ├── components/         # Composants React
│   ├── features/          # Fonctionnalités par domaine
│   └── hooks/             # Hooks personnalisés
├── server/                # Code côté serveur
│   ├── components/        # Composants serveur
│   └── features/         # Server Actions par domaine
├── lib/                   # Utilitaires partagés
├── types/                 # Types TypeScript
└── tests/                 # Tests unitaires
```

## 🧪 Tests

```bash
# Lancement des tests
npm test

# Tests en mode watch
npm run test:watch

# Rapport de couverture
npm run test:coverage
```

## 📦 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Vérification du code
- `npm run test` - Lancement des tests

## 🔗 Liens utiles

- [Documentation complète](./Documentation/README.md)
- [Altered TCG](https://alteredtcg.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

_Projet développé pour la communauté Altered TCG_
