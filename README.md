# Application de Réservation en Ligne

## Présentation

Cette application de réservation en ligne est une plateforme complète permettant de gérer des propriétés locatives, des réservations, des paiements et l'interaction entre hôtes et clients. Développée avec une architecture microservices, elle offre une solution robuste, évolutive et hautement personnalisable.

## Architecture Microservices

L'application est construite autour de 15 microservices spécialisés qui communiquent entre eux via une API Gateway centrale :

1. **Service d'authentification et de gestion utilisateurs**
   - Inscription, connexion et déconnexion
   - Gestion des profils (clients et administrateurs)
   - Authentification JWT et refresh tokens
   - Gestion des rôles et des permissions
   - Réinitialisation des mots de passe

2. **Service de gestion des propriétés**
   - CRUD des propriétés et leurs détails
   - Gestion des équipements (amenities)
   - Stockage et gestion des images
   - Gestion des caractéristiques de sécurité
   - Tarification (standard, hebdomadaire, bi-hebdomadaire)

3. **Service de calendrier et disponibilités**
   - Gestion du calendrier de disponibilité
   - Vérification des disponibilités en temps réel
   - Blocage et déblocage de dates
   - Tarification spéciale par date
   - Intégration avec les API de calendrier externes
   - Synchronisation entre différents canaux de réservation

4. **Service de réservation**
   - Création et gestion des réservations
   - Gestion des annulations et modifications
   - Calcul des prix (incluant réductions)
   - Gestion des demandes spéciales
   - États des réservations (confirmé, annulé, etc.)

5. **Service de paiement**
   - Intégration avec PayPal, Stripe, etc.
   - Gestion des dépôts de garantie
   - Remboursements
   - Facturation
   - Sécurisation des transactions
   - Historique des paiements

6. **Service de géolocalisation et cartographie**
   - Intégration avec l'API Google Maps ou alternatives
   - Affichage des propriétés sur la carte
   - Calcul des distances avec les points d'intérêt
   - Recherche géographique de propriétés
   - Suggestions basées sur la localisation

7. **Service de recherche et filtrage**
   - Recherche avancée de propriétés
   - Filtrage par critères (équipements, prix, dates)
   - Indexation des contenus pour recherche rapide
   - Suggestions de recherche
   - Recherche par localisation

8. **Service de notifications**
   - Notifications par email
   - SMS/notifications push
   - Rappels (check-in, check-out)
   - Alertes système
   - Notifications administrateurs

9. **Service de reviews et évaluations**
   - Gestion des avis clients
   - Calcul des notes moyennes
   - Modération des commentaires
   - Publication différée (après 2 semaines)
   - Réponses aux avis par les administrateurs

10. **Service de contenu et CMS**
    - Gestion des pages statiques
    - Blog et articles
    - FAQ et aide
    - Traductions et internationalisation
    - Ressources médias

11. **Service d'analyse et statistiques**
    - Tableau de bord administrateur
    - Rapports de performance
    - Statistiques de réservation
    - Comportement utilisateur
    - Prévisions et tendances

12. **Service de messaging**
    - Communication entre clients et hôtes
    - Historique des conversations
    - Notifications de nouveaux messages
    - Modèles de réponses pour l'équipe

13. **Service de promotion et réductions**
    - Gestion des codes promotionnels
    - Programmes de fidélité
    - Réductions saisonnières
    - Offres spéciales
    - Attribution automatique des réductions

14. **Service de recommandation**
    - Suggestions personnalisées
    - Propriétés similaires
    - Points d'intérêt à proximité
    - Recommandations basées sur l'historique

15. **API Gateway**
    - Point d'entrée unifié pour les clients
    - Routage des requêtes vers les microservices
    - Gestion de l'authentification
    - Limitation de débit (rate limiting)
    - Logging et monitoring

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/application-reservation.git

# Accéder au répertoire du projet
cd application-reservation

# Installer les dépendances
docker-compose build
```

## Configuration

1. Copiez le fichier `.env.example` en `.env` et configurez les variables d'environnement nécessaires :
   ```bash
   cp .env.example .env
   ```

2. Modifiez les configurations spécifiques de chaque microservice selon vos besoins dans le dossier `config/`.

## Démarrage

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier le statut des services
docker-compose ps
```

L'application sera accessible à l'adresse : http://localhost:3000

## Documentation API

La documentation complète de l'API est disponible à l'adresse : http://localhost:3000/api/docs

## Technologies utilisées

- **Backend** : Node.js, Express, Nest.js
- **Frontend** : React, Redux, Material UI
- **Base de données** : MongoDB, PostgreSQL, Redis
- **Messagerie** : RabbitMQ
- **Authentification** : JWT, OAuth2
- **Conteneurisation** : Docker, Kubernetes
- **CI/CD** : Jenkins, GitHub Actions
- **Monitoring** : Prometheus, Grafana

## Développement

### Structure du projet

```
application-reservation/
├── api-gateway/
├── services/
│   ├── auth-service/
│   ├── property-service/
│   ├── calendar-service/
│   ├── booking-service/
│   ├── payment-service/
│   └── ...
├── frontend/
├── config/
├── scripts/
└── docs/
```

### Tests

```bash
# Exécuter tous les tests
npm run test

# Exécuter les tests d'un service spécifique
npm run test -- --scope=auth-service
```

## Déploiement

### Production

```bash
# Construire pour la production
docker-compose -f docker-compose.prod.yml build

# Déployer en production
docker-compose -f docker-compose.prod.yml up -d
```

### Staging

```bash
# Déployer en environnement de staging
docker-compose -f docker-compose.staging.yml up -d
```

## Contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement à l'adresse craigarmel01@gmail.com