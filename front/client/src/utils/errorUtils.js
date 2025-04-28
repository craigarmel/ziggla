/**
 * Utilitaires pour la gestion des erreurs dans l'application
 */

// Fonction pour vérifier si une valeur existe (non null/undefined)
export const exists = (value) => value !== null && value !== undefined;

// Fonction pour accéder en toute sécurité à une propriété imbriquée d'un objet
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  // Gérer le cas où path est déjà un tableau
  const keys = Array.isArray(path) ? path : path.split('.');
  
  let result = obj;
  for (const key of keys) {
    if (!exists(result) || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return exists(result) ? result : defaultValue;
};

// Fonction pour gérer les erreurs des requêtes API
export const handleApiError = (error) => {
  // Logger l'erreur complète pour debugging
  console.error('API Error:', error);
  
  // Extraire le message d'erreur le plus pertinent
  let errorMessage = 'Une erreur inattendue est survenue.';
  
  if (error.response) {
    // Erreur de réponse du serveur
    const status = error.response.status;
    const data = error.response.data;
    
    if (data && data.message) {
      errorMessage = data.message;
    } else if (status === 400) {
      errorMessage = 'Requête invalide. Veuillez vérifier vos données.';
    } else if (status === 401) {
      errorMessage = 'Authentification requise. Veuillez vous connecter.';
    } else if (status === 403) {
      errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (status === 404) {
      errorMessage = 'Ressource non trouvée.';
    } else if (status === 422) {
      errorMessage = 'Données invalides. Veuillez vérifier votre saisie.';
    } else if (status >= 500) {
      errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    }
  } else if (error.request) {
    // Requête envoyée mais pas de réponse reçue
    errorMessage = 'Impossible de communiquer avec le serveur. Vérifiez votre connexion internet.';
  } else if (error.message) {
    // Erreur lors de la configuration de la requête
    errorMessage = error.message;
  }
  
  return errorMessage;
};

// Fonction pour valider une propriété avant utilisation
export const validatePropertyData = (property) => {
  if (!property) {
    throw new Error('Données de propriété non disponibles');
  }
  
  // Liste des champs obligatoires
  const requiredFields = ['_id', 'name'];
  
  for (const field of requiredFields) {
    if (!exists(property[field])) {
      throw new Error(`Champ obligatoire manquant: ${field}`);
    }
  }
  
  return true;
};

// Fonction pour formater les erreurs de validation du formulaire
export const formatValidationErrors = (errors) => {
  if (!errors) return {};
  
  // Si errors est déjà un objet formaté, le retourner tel quel
  if (typeof errors === 'object' && !Array.isArray(errors)) {
    return errors;
  }
  
  // Si errors est un tableau, le convertir en objet
  if (Array.isArray(errors)) {
    return errors.reduce((acc, error) => {
      if (error.field && error.message) {
        acc[error.field] = error.message;
      }
      return acc;
    }, {});
  }
  
  // Si errors est une chaîne, en faire une erreur générale
  if (typeof errors === 'string') {
    return { general: errors };
  }
  
  return {};
};

// Fonction pour détecter les erreurs réseau
export const isNetworkError = (error) => {
  return (
    error.message === 'Network Error' ||
    (error.request && !error.response) ||
    error.code === 'ECONNABORTED'
  );
};

export default {
  exists,
  safeGet,
  handleApiError,
  validatePropertyData,
  formatValidationErrors,
  isNetworkError
};