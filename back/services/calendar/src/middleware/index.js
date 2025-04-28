/**
 * Fichier: src/middleware/index.js
 * Description: Middleware pour le microservice de calendrier
 */

const rateLimit = require('express-rate-limit');
const { authorize } = require('../utils/googleCalendar');

/**
 * Middleware pour vérifier l'authentification
 */
const authCheck = async (req, res, next) => {
  try {
    // Vérifier le jeton d'API si nécessaire
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ 
        error: 'Accès non autorisé',
        message: 'Clé API invalide ou manquante'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};

/**
 * Middleware pour vérifier l'authentification Google
 */
const googleAuthCheck = async (req, res, next) => {
  try {
    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ 
        error: 'Échec d\'authentification Google',
        message: 'Impossible d\'obtenir les informations d\'authentification Google' 
      });
    }

    // Stocker l'objet d'authentification pour les contrôleurs
    req.googleAuth = auth;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification Google:', error);
    res.status(500).json({ 
      error: 'Erreur d\'authentification Google',
      message: error.message 
    });
  }
};

/**
 * Limiter les requêtes pour éviter les abus
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par fenêtre
  standardHeaders: true, // Retourner les en-têtes standards 'RateLimit-*'
  legacyHeaders: false, // Désactiver les en-têtes 'X-RateLimit-*'
  message: {
    error: 'Trop de requêtes',
    message: 'Vous avez dépassé la limite de requêtes. Veuillez réessayer plus tard.'
  }
});

/**
 * Middleware pour valider les données d'événement
 */
const validateEventData = (req, res, next) => {
  const { summary, start, end } = req.body;

  if (!summary) {
    return res.status(400).json({
      error: 'Données manquantes',
      message: 'Le champ summary est requis'
    });
  }

  if (!start || !start.dateTime) {
    return res.status(400).json({
      error: 'Données manquantes',
      message: 'Le champ start.dateTime est requis'
    });
  }

  if (!end || !end.dateTime) {
    return res.status(400).json({
      error: 'Données manquantes',
      message: 'Le champ end.dateTime est requis'
    });
  }

  // Valider que la date de début est avant la date de fin
  const startDate = new Date(start.dateTime);
  const endDate = new Date(end.dateTime);

  if (startDate >= endDate) {
    return res.status(400).json({
      error: 'Données invalides',
      message: 'La date de début doit être antérieure à la date de fin'
    });
  }

  // Valider le format des dates ISO 8601
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
  
  if (!isoDateRegex.test(start.dateTime)) {
    return res.status(400).json({
      error: 'Format de date invalide',
      message: 'Le format de start.dateTime doit être ISO 8601 (ex: 2025-05-01T09:00:00+02:00)'
    });
  }

  if (!isoDateRegex.test(end.dateTime)) {
    return res.status(400).json({
      error: 'Format de date invalide',
      message: 'Le format de end.dateTime doit être ISO 8601 (ex: 2025-05-01T10:00:00+02:00)'
    });
  }

  next();
};

/**
 * Middleware pour logger les requêtes
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;
  
  console.log(`[${timestamp}] ${method} ${originalUrl} - IP: ${ip}`);
  
  // Mesurer le temps de réponse
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

/**
 * Middleware pour gérer les erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  
  // Si l'erreur vient de l'API Google
  if (err.code) {
    switch (err.code) {
      case 404:
        return res.status(404).json({
          error: 'Ressource non trouvée',
          message: err.message
        });
      case 400:
        return res.status(400).json({
          error: 'Requête invalide',
          message: err.message
        });
      case 403:
        return res.status(403).json({
          error: 'Accès interdit',
          message: 'Vous n\'avez pas les permissions nécessaires'
        });
      default:
        return res.status(500).json({
          error: 'Erreur du serveur',
          message: err.message
        });
    }
  }
  
  res.status(500).json({
    error: 'Erreur du serveur',
    message: err.message || 'Une erreur inattendue s\'est produite'
  });
};

// Exporter tous les middleware
module.exports = {
  authCheck,
  googleAuthCheck,
  apiRateLimiter,
  validateEventData,
  requestLogger,
  errorHandler
};