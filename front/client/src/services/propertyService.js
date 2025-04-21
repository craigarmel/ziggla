import axios from 'axios';

const API_URL = 'http://localhost:5001/api/properties';

// Configuration d'Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajout du token d'authentification aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variables pour stocker les données de l'API
let properties = [];
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

const propertyService = {
  // Récupérer toutes les propriétés
  getAllProperties: async (filters = {}, forceRefresh = false) => {
    // Utiliser le cache si disponible et récent
    const now = Date.now();
    if (!forceRefresh && properties.length > 0 && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
      return properties;
    }
    
    try {
      const response = await api.get('/', { params: filters });
      properties = response.data.data; // Stocker les données du tableau
      lastFetchTime = Date.now();
      return properties;
    } catch (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      throw error;
    }
  },

  // Récupérer une propriété par son ID
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la propriété ${id}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle propriété
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/', propertyData);
      // Rafraîchir la liste des propriétés
      await propertyService.getAllProperties({}, true);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la création de la propriété:', error);
      throw error;
    }
  },

  // Mettre à jour une propriété
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/${id}`, propertyData);
      // Rafraîchir la liste des propriétés
      await propertyService.getAllProperties({}, true);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la propriété ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une propriété
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      // Rafraîchir la liste des propriétés
      await propertyService.getAllProperties({}, true);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la propriété ${id}:`, error);
      throw error;
    }
  },

  // Utilitaires pour manipuler les données en cache
  getPropertiesFromCache: () => {
    return properties;
  },

  filterPropertiesByPrice: (minPrice, maxPrice) => {
    return properties.filter(property => 
      property.price >= minPrice && property.price <= maxPrice
    );
  },

  filterPropertiesByType: (propertyType) => {
    return properties.filter(property => 
      property.propertyType === propertyType
    );
  },

  sortPropertiesByPrice: (ascending = true) => {
    return [...properties].sort((a, b) => 
      ascending ? a.price - b.price : b.price - a.price
    );
  }
};

export default propertyService;