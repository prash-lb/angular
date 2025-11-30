🚄 Application de Réservation de Train

Bienvenue dans l'application de réservation de train. Ce projet vise à offrir une interface utilisateur moderne et réactive, construite avec Angular, pour rechercher et simuler la réservation de trajets ferroviaires, en s'appuyant sur des données simulées et en étant préparé pour l'intégration d'une API de transport réelle (SNCF).

✨ Fonctionnalités

Recherche de Trajets : Permet de rechercher des trajets entre deux gares avec une date et un nombre de passagers.

Formulaires Réactifs : Utilisation d'Angular Reactive Forms avec validation personnalisée (empêchant le départ et l'arrivée d'être identiques).

Affichage des Résultats : Présentation claire et stylisée des trajets disponibles, incluant la durée et le prix.

Architecture Standalone : Le code est construit avec des composants, directives et pipes Angular standalone.

⚙️ Démarrage du Projet

Pour lancer l'application, vous devez exécuter trois étapes principales : installer les dépendances, lancer le serveur de fausses données (JSON Server) et démarrer le front-end.

1. Installation des Dépendances

Ouvrez votre terminal dans le répertoire racine du projet et exécutez la commande d'installation des packages :

npm install

2. Configuration de l'API SNCF

Bien que l'application actuelle utilise des données fictives pour les résultats de recherche, elle est conçue pour s'intégrer facilement à l'API de la SNCF pour des données réelles.

Vous devez créer un fichier nommé .env à la racine de votre projet. Ce fichier contiendra la clé d'API nécessaire pour toute future connexion au service SNCF.

# Fichier: .env

# Clé d'API nécessaire pour les requêtes vers l'API SNCF

NG_APP_KEY_API_SNCF="ec42d874-566c-4bdd-b158-d7fc41d9f983"

3. Lancement du Serveur de Données Simulé (JSON Server)

Le projet utilise json-server pour simuler un backend RESTful simple, hébergeant un fichier de fausses données (backend/db.json). Ceci est essentiel pour simuler les requêtes de recherche et d'autocomplétion.

Dans un premier terminal, exécutez la commande suivante :

npx json-server backend/db.json

Ce serveur tournera généralement sur http://localhost:3000.

4. Lancement du Front-end Angular

Une fois que JSON Server est en cours d'exécution dans le premier terminal, ouvrez un second terminal et lancez l'application Angular :

npm start

Le front-end démarrera et sera accessible dans votre navigateur (généralement à http://localhost:4200).
