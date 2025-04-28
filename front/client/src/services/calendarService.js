import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5002/api'}/calendar`;

// Création d'une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
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

const calendarService = {
  // Récupérer tous les calendriers
  getCalendars: async () => {
    try {
      const response = await api.get('/calendars');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des calendriers:', error);
      throw error;
    }
  },

  // Récupérer tous les événements
  getEvents: async (filters = {}) => {
    try {
      const response = await api.get('/events', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  },

  // Récupérer un événement par son ID
  getEvent: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'événement ${eventId}:`, error);
      throw error;
    }
  },

  // Créer un nouvel événement (réservation)
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  },

  // Mettre à jour un événement
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'événement ${eventId}:`, error);
      throw error;
    }
  },

  // Supprimer un événement
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'événement ${eventId}:`, error);
      throw error;
    }
  },

  // Vérifier la disponibilité d'une propriété
  checkAvailability: async (propertyId, startDate, endDate) => {
    try {
      const response = await api.post('/availability', {
        propertyId,
        startDate,
        endDate
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      throw error;
    }
  },

  // Créer une réservation
  createBooking: async (bookingData) => {
    try {
      const formattedData = {
        ...bookingData,
        type: 'booking'
      };
      
      const response = await api.post('/events', formattedData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  },
  
  // Récupérer les événements d'une propriété
  getPropertyEvents: async (propertyId) => {
    try {
      const response = await api.get('/events', {
        params: { propertyId }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des événements pour la propriété ${propertyId}:`, error);
      throw error;
    }
  }
};

export default calendarService;