# Altered Stats Arena

Application web communautaire pour le suivi des statistiques du jeu de cartes **Altered TCG**. Permet aux joueurs d'enregistrer leurs parties, d'analyser les métas, de découvrir les factions les plus jouées et d'améliorer leurs performances.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Configuration de la base de données
npm run prisma:generate
npm run prisma:migrate

# Lancement du serveur de développement
npm run dev

# Ouverture dans le navigateur
# http://localhost:3000
```

## ✨ Fonctionnalités principales

### 🎮 Gestion des matchs

- **Création de matchs** : Workflow en étapes (héros, adversaire, événement, résultat)
- **Formats supportés** : BO1, BO3, BO5, BO7, BO9
- **Statuts** : En cours, victoire, défaite, nul
- **Commentaires** : Notes détaillées sur les matchs et jeux

### 📊 Statistiques avancées

- **Performance** : Taux de victoire par faction et héros
- **Analyse des métas** : Factions et héros les plus joués
- **Rivalités** : Statistiques des matchups
- **Évolution** : Suivi des performances dans le temps

### 👥 Gestion communautaire

- **Profils joueurs** : Alias, factions/héros favoris
- **Saisons** : Organisation temporelle des événements
- **Tournois** : Gestion des événements compétitifs
- **Administration** : Interface complète pour les modérateurs

## 🛠️ Technologies utilisées

### Frontend

- **Framework** : Next.js 15 avec App Router (architecture moderne)
- **UI** : ShadCN/UI + Radix UI + Tailwind CSS v4
- **Styling** : Variables CSS personnalisées avec thèmes clair/sombre
- **État** : Hooks React personnalisés + Server Components

### Backend

- **Base de données** : Supabase (PostgreSQL) avec Prisma ORM
- **Authentification** : Supabase Auth avec Google OAuth
- **API** : Server Actions Next.js + API Routes
- **Validation** : Zod pour la validation des données

### Outils de développement

- **Tests** : Vitest + Testing Library + jsdom
- **Qualité** : ESLint + Prettier + Husky
- **Performance** : Turbopack + Vercel Speed Insights
- **TypeScript** : Typage strict avec configuration optimisée

## 🏗️ Architecture du projet

### Structure des dossiers

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/           # Routes d'authentification
│   ├── admin/            # Interface d'administration
│   ├── dashboard/        # Tableau de bord utilisateur
│   ├── stats/            # Page des statistiques
│   └── legal/            # Pages légales
├── client/               # Code côté client
│   ├── components/       # Composants React réutilisables
│   ├── features/         # Fonctionnalités par domaine métier
│   └── hooks/            # Hooks personnalisés
├── server/               # Code côté serveur
│   ├── components/       # Composants serveur
│   └── features/         # Server Actions par domaine
├── lib/                  # Utilitaires partagés
├── types/                # Types TypeScript globaux
└── styles/               # Styles globaux et thèmes
```

### Modèle de données

- **Player** : Joueurs avec alias, favoris, rôles
- **Faction** : Factions du jeu avec codes couleur
- **Hero** : Héros associés aux factions
- **Season** : Saisons de jeu avec dates
- **Event** : Événements (tournois, amicaux)
- **Match** : Parties avec statut et format
- **Game** : Jeux individuels dans un match

## 🎨 Système de design

### Thèmes et couleurs

- **Support clair/sombre** : Variables CSS personnalisées
- **Palette** : Couleurs primaires bleues, secondaires beiges
- **Feedback** : États de succès, erreur, warning, info
- **Transitions** : 0.3s ease-in-out pour tous les changements

### Composants UI

- **Base** : ShadCN/UI avec composants Radix UI
- **Responsive** : Mobile-first avec breakpoints personnalisés
- **Accessibilité** : Support ARIA et navigation clavier
- **Personnalisation** : Composants adaptés au design system

## 🧪 Tests et qualité

### Tests unitaires

```bash
# Lancement des tests
npm test

# Tests en mode watch
npm run test:watch

# Rapport de couverture
npm run test:coverage

# Interface graphique
npm run test:ui
```

### Qualité du code

- **ESLint** : Configuration Next.js + règles personnalisées
- **Prettier** : Formatage automatique avec tri des imports
- **Husky** : Hooks Git pour la qualité
- **Lint-staged** : Vérifications avant commit

## 📦 Scripts disponibles

### Développement

- `npm run dev` - Serveur de développement avec Turbopack
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Vérification du code
- `npm run format` - Formatage automatique

### Tests

- `npm run test` - Lancement des tests
- `npm run test:watch` - Tests en mode watch
- `npm run test:coverage` - Rapport de couverture
- `npm run test:ui` - Interface graphique des tests

### Base de données

- `npm run prisma:generate` - Génération du client Prisma
- `npm run prisma:migrate` - Exécution des migrations
- `npm run prisma:studio` - Interface d'administration Prisma
- `npm run prisma:seed` - Peuplement de la base de données

### Performance

- `npm run build:analyze` - Analyse des bundles
- `npm run test:stats-performance` - Tests de performance des statistiques
- `npm run analyze:index-usage` - Analyse de l'utilisation des index

## 🚀 Performance et optimisation

### Next.js

- **Turbopack** : Compilation rapide en développement
- **App Router** : Architecture moderne avec Server Components
- **Caching** : Stratégies de cache intelligentes
- **Bundle optimization** : Analyse et optimisation des tailles

### Base de données

- **Index** : Optimisation des requêtes avec Prisma
- **Migrations** : Gestion des schémas avec versioning
- **Performance** : Scripts d'analyse et d'optimisation
- **Cache** : Stratégies de revalidation intelligentes

## 📱 Responsive et accessibilité

### Mobile-first

- **Breakpoints** : 375px, 768px, 1024px, 1440px
- **Navigation** : Menu mobile adaptatif
- **Touch** : Interactions tactiles optimisées

### Accessibilité

- **ARIA** : Labels et descriptions appropriés
- **Navigation** : Support clavier et lecteurs d'écran
- **Contraste** : Thèmes avec ratios appropriés
- **Sémantique** : HTML sémantique et structure logique

## 🔐 Sécurité

### Authentification

- **Supabase Auth** : Système d'authentification sécurisé
- **Google OAuth** : Connexion via Google
- **Rôles** : Système de permissions user/admin
- **Session** : Gestion sécurisée des sessions

### Protection des données

- **Validation** : Zod pour toutes les entrées utilisateur
- **Sanitisation** : Nettoyage avec DOMPurify
- **RLS** : Row Level Security PostgreSQL
- **CORS** : Configuration sécurisée des requêtes

## 📚 Documentation

La documentation complète du projet est organisée dans le dossier [`Documentation/`](./Documentation/README.md) :

- **🎨 Design** : [Système de design](./Documentation/design/design-system.md)
- **💻 Développement** :
  - [Gestion d'erreurs](./Documentation/development/error-handling.md)
  - [Tests unitaires](./Documentation/development/testing.md)
  - [Performance des statistiques](./Documentation/development/statistics-performance.md)
- **🔌 API** : Documentation des endpoints (à venir)
- **🏗️ Architecture** : Architecture générale (à venir)

## 🔗 Liens utiles

- [Documentation complète](./Documentation/README.md)
- [Altered TCG](https://alteredtcg.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribution

Ce projet est développé pour la communauté Altered TCG. Les contributions sont les bienvenues !

### Bonnes pratiques

- Respecter l'architecture existante
- Suivre les conventions de nommage
- Ajouter des tests pour les nouvelles fonctionnalités
- Maintenir la qualité du code avec ESLint et Prettier

---

_Projet développé pour la communauté Altered TCG_ 🎴

