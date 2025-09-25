# EfreiAngularWecard

EfreiAngularWecard est une application Angular permettant de gérer des collections de cartes Weward. Elle offre des fonctionnalités pour explorer, échanger et compléter des collections, tout en permettant aux utilisateurs de gérer leurs profils et leurs comptes externes.

## Auteure
Elise Labarrere

## Fonctionnalités principales

- **Gestion des utilisateurs** : Inscription, connexion, réinitialisation de mot de passe et mise à jour du profil.
- **Exploration des collections** : Parcourez les collections des autres utilisateurs et découvrez leurs progrès.
- **Gestion des chapitres** : Ajoutez, modifiez et gérez les chapitres de cartes (pour les administrateurs).
- **Échange de cartes** : Proposez des échanges pour compléter vos collections.
- **Mode sombre** : Interface utilisateur adaptée au mode sombre.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version recommandée : 16 ou supérieure)
- [Angular CLI](https://angular.io/cli) (version 19 ou supérieure)

## Installation

1. Clonez le dépôt :

```bash
git clone <URL_DU_DEPOT>
cd efrei-angular--wecard
```

2. Installez les dépendances :

```bash
npm install
```

## Démarrage du serveur de développement

Pour démarrer le serveur de développement, exécutez :

```bash
npm start
```

Accédez ensuite à l'application dans votre navigateur à l'adresse suivante : [http://localhost:4200](http://localhost:4200).

## Scripts disponibles

- **Démarrer le serveur de développement** : `npm start`
- **Construire le projet** : `npm run build`
- **Exécuter les tests unitaires** : `npm test`
- **Linter le code** : `npm run lint`
- **Formater le code** : `npm run format`

## Tests unitaires

Pour exécuter les tests unitaires avec Karma, utilisez :

```bash
npm test
```

## Structure du projet

Voici un aperçu de la structure du projet :

```bash
src/
├── app/
│   ├── core/                # Services et gardes partagés
│   ├── features/            # Fonctionnalités principales (auth, user, collection, etc.)
│   ├── shared/              # Composants et services réutilisables
│   ├── app.component.ts     # Composant principal
│   ├── [app.routes.ts](http://_vscodecontentref_/1)        # Configuration des routes
├── assets/                  # Ressources statiques
├── [styles.scss](http://_vscodecontentref_/2)              # Styles globaux
```

## Technologies utilisées

- **Framework** : Angular
- **Langage** : TypeScript
- **Styles** : TailwindCSS
- **Icônes** : FontAwesome
- **Tests** : Jasmine, Karma
- **Linting** : ESLint, Prettier