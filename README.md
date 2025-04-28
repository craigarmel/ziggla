# Projet Ziggla - Guide d'installation et de configuration

## Vue d'ensemble

Ziggla est une plateforme de réservation basée sur une architecture microservices. Ce document vous guidera à travers les étapes nécessaires pour configurer et déployer l'ensemble de la plateforme.

## Architecture du projet

Le projet est composé des microservices suivants :

- **Auth service** (port 5000) : Gestion de l'authentification et des utilisateurs
- **Properties service** (port 5001) : Gestion des propriétés et des annonces
- **Calendar service** (port 5002) : Gestion des disponibilités et synchronisation avec Google Calendar
- **Bookings service** (port 5003) : Gestion des réservations
- **Reviews service** (port 5004) : Gestion des avis et commentaires
- **Frontend** (port 3000) : Interface utilisateur

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) (pour le développement local)
- Compte Google Cloud Platform (pour les fonctionnalités de calendrier)

## 1. Préparation de l'environnement

### Cloner le dépôt

```bash
git clone <URL_DU_DEPOT_GIT>
cd ziggla
```

### Structure des dossiers

Assurez-vous que votre structure de dossiers est organisée comme suit :

```
ziggla/
├── back/
│   └── services/
│       ├── auth/
│       ├── bookings/
│       ├── calendar/
│       ├── properties/
│       └── reviews/
├── front/
│   └── client/
└── docker-compose.yml
```

## 2. Configuration du service Calendar (Google Calendar API)

Le service Calendar nécessite des identifiants pour se connecter à l'API Google Calendar :

### Obtenir des identifiants Google Cloud

1. Connectez-vous à la [Console Google Cloud](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Google Calendar pour ce projet
4. Créez des identifiants OAuth 2.0
5. Téléchargez le fichier JSON des identifiants

### Configurer les fichiers d'authentification

1. Renommez le fichier d'identifiants téléchargé en `credentials.json`
2. Placez-le dans le dossier `back/services/calendar/`
3. Le fichier `token.json` sera généré automatiquement lors de la première connexion

## 3. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Variables globales
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://mongo:27017/ziggla

# Auth Service
JWT_SECRET=votre_cle_secrete_tres_securisee
JWT_EXPIRE=30d

# Google Calendar
GOOGLE_CALENDAR_ID=votre_id_calendrier@group.calendar.google.com
GOOGLE_CALENDAR_EMAIL=votre_email@google.com
GOOGLE_PRIVATE_KEY=votre_clé_privée
```

> **Note** : Ne jamais committer le fichier `.env` dans votre dépôt Git. Ajoutez-le au fichier `.gitignore`.

## 4. Lancement des services avec Docker Compose

### Construire et démarrer tous les services

```bash
docker-compose up -d
```

Cette commande construira toutes les images et démarrera tous les conteneurs en mode détaché.

### Vérifier que les conteneurs sont en cours d'exécution

```bash
docker-compose ps
```

### Consulter les logs

Pour voir les logs de tous les services :

```bash
docker-compose logs
```

Pour un service spécifique :

```bash
docker-compose logs auth
```

## 5. Accès aux différents services

Une fois les conteneurs démarrés, vous pouvez accéder aux services suivants :

- Frontend : http://localhost:3000
- Auth API : http://localhost:5000
- Properties API : http://localhost:5001
- Calendar API : http://localhost:5002
- Bookings API : http://localhost:5003
- Reviews API : http://localhost:5004
- MongoDB : mongodb://localhost:27017

## 6. Développement local sans Docker

Si vous préférez développer sans Docker, suivez ces étapes pour chaque service :

### Installer MongoDB localement

Téléchargez et installez [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

### Configuration des services backend

Pour chaque service dans le dossier `back/services/` :

1. Naviguez vers le dossier du service
2. Créez un fichier `.env` local avec les variables appropriées
3. Installez les dépendances et démarrez le service :

```bash
cd back/services/auth
npm install
npm run dev
```

Répétez pour chaque service en adaptant le chemin et les variables d'environnement.

### Configuration du frontend

```bash
cd front/client
npm install
npm run dev
```

Récupérez l'exemple de documents pour la base de données MongoDB dans le dossier `back/services/mongoDB/` et importez-le dans votre instance MongoDB locale.

## 7. Gestion des données MongoDB

### Accéder à la base de données via MongoDB Compass

1. Installez [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connectez-vous à `mongodb://localhost:27017/ziggla`

### Sauvegarde des données

Pour sauvegarder votre base de données :

```bash
docker exec ziggla-mongo mongodump --out /data/db/backup
```

### Restauration des données

Pour restaurer votre base de données :

```bash
docker exec ziggla-mongo mongorestore /data/db/backup
```

## 8. Déploiement en production

### Sécurité

Pour un déploiement en production, assurez-vous de :

1. Utiliser des mots de passe forts pour MongoDB
2. Configurer HTTPS pour tous les services
3. Limiter l'accès aux ports et réseaux
4. Mettre à jour régulièrement les dépendances

### Variables d'environnement de production

Modifiez votre fichier `.env` pour la production :

```env
NODE_ENV=production
MONGO_URI=mongodb://username:password@mongo:27017/ziggla
# Autres variables spécifiques à la production
```

### Construire et déployer

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 9. Dépannage

### Problèmes courants et solutions

1. **Les conteneurs ne démarrent pas**
   - Vérifiez les logs : `docker-compose logs`
   - Assurez-vous que les ports ne sont pas déjà utilisés

2. **Problèmes de connexion entre services**
   - Vérifiez que les services sont sur le même réseau Docker
   - Assurez-vous que les URLs des services sont correctes

3. **Erreurs avec l'API Google Calendar**
   - Vérifiez les permissions et que l'API est activée
   - Assurez-vous que les identifiants sont corrects

## 10. Maintenance

### Mise à jour des services

Pour mettre à jour un service après des modifications de code :

```bash
docker-compose build auth
docker-compose up -d auth
```

### Nettoyage

Pour arrêter et supprimer tous les conteneurs, réseaux et volumes :

```bash
docker-compose down -v
```

## 11. Ressources supplémentaires

- [Documentation Docker](https://docs.docker.com/)
- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Documentation Express.js](https://expressjs.com/)
- [Documentation React](https://reactjs.org/docs/getting-started.html)

## 12. Contribution au projet

### Guide de contribution

1. Créez une branche pour votre fonctionnalité : `git checkout -b feature/nouvelle-fonctionnalite`
2. Committez vos changements : `git commit -m 'Ajouter une nouvelle fonctionnalité'`
3. Poussez vers la branche : `git push origin feature/nouvelle-fonctionnalite`
4. Ouvrez une Pull Request

### Normes de codage

- Suivez les conventions ESLint du projet
- Écrivez des tests unitaires pour les nouvelles fonctionnalités
- Documentez votre code

---

Pour toute question ou problème, veuillez ouvrir une issue dans le dépôt GitHub ou contacter l'équipe de développement.