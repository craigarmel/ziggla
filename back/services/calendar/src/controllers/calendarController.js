/**
 * Fichier: src/controllers/calendarController.js
 * Description: Contrôleurs pour les opérations du calendrier
 */

const { 
  authorize, 
  getAllCalendarEvents, 
  createCalendarEvent, 
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvent,
  listCalendars
} = require('../utils/googleCalendar');

/**
 * Récupère tous les événements du calendrier
 */
const getEvents = async (req, res) => {
  try {
    // Filtrage et pagination
    const { 
      startDate, 
      endDate, 
      maxResults = 10, 
      pageToken, 
      calendarId = 'primary'
    } = req.query;

    // Construire les options
    const options = {
      maxResults: parseInt(maxResults, 10),
      singleEvents: true,
      orderBy: 'startTime'
    };

    // Ajouter des filtres si présents
    if (startDate) {
      options.timeMin = new Date(startDate).toISOString();
    } else {
      options.timeMin = new Date().toISOString();
    }

    if (endDate) {
      options.timeMax = new Date(endDate).toISOString();
    }

    if (pageToken) {
      options.pageToken = pageToken;
    }

    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ error: 'Échec de l\'authentification' });
    }

    const events = await getAllCalendarEvents(auth, calendarId, options);
    
    res.status(200).json({ 
      events: events.items || [], 
      nextPageToken: events.nextPageToken || null,
      nextSyncToken: events.nextSyncToken || null
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des événements',
      message: error.message 
    });
  }
};

/**
 * Récupère un événement spécifique par son ID
 */
const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { calendarId = 'primary' } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: 'ID d\'événement requis' });
    }

    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ error: 'Échec de l\'authentification' });
    }

    const event = await getCalendarEvent(auth, eventId, calendarId);
    
    res.status(200).json({ event });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(error.code === 404 ? 404 : 500).json({ 
      error: 'Erreur lors de la récupération de l\'événement',
      message: error.message 
    });
  }
};

/**
 * Crée un nouvel événement dans le calendrier
 */
const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const { calendarId = 'primary' } = req.query;

    // Valider les données d'entrée
    if (!eventData.summary || !eventData.start || !eventData.end) {
      return res.status(400).json({ 
        error: 'Données d\'événement invalides',
        message: 'Les champs summary, start et end sont requis' 
      });
    }

    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ error: 'Échec de l\'authentification' });
    }

    // Ajouter des métadonnées de réservation si nécessaire
    if (eventData.bookingInfo) {
      if (!eventData.extendedProperties) {
        eventData.extendedProperties = { private: {} };
      } else if (!eventData.extendedProperties.private) {
        eventData.extendedProperties.private = {};
      }
      
      eventData.extendedProperties.private.bookingInfo = JSON.stringify(eventData.bookingInfo);
      delete eventData.bookingInfo; // Supprimer du corps principal
    }

    const createdEvent = await createCalendarEvent(auth, eventData, calendarId);
    
    res.status(201).json({ event: createdEvent });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de l\'événement',
      message: error.message 
    });
  }
};

/**
 * Met à jour un événement existant
 */
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = req.body;
    const { calendarId = 'primary' } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: 'ID d\'événement requis' });
    }

    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ error: 'Échec de l\'authentification' });
    }

    // Gérer les métadonnées de réservation
    if (eventData.bookingInfo) {
      if (!eventData.extendedProperties) {
        eventData.extendedProperties = { private: {} };
      } else if (!eventData.extendedProperties.private) {
        eventData.extendedProperties.private = {};
      }
      
      eventData.extendedProperties.private.bookingInfo = JSON.stringify(eventData.bookingInfo);
      delete eventData.bookingInfo;
    }

    const updatedEvent = await updateCalendarEvent(auth, eventId, eventData, calendarId);
    
    res.status(200).json({ event: updatedEvent });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(error.code === 404 ? 404 : 500).json({ 
      error: 'Erreur lors de la mise à jour de l\'événement',
      message: error.message 
    });
  }
};

/**
 * Supprime un événement
 */
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { calendarId = 'primary', sendUpdates = 'none' } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: 'ID d\'événement requis' });
    }

    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ error: 'Échec de l\'authentification' });
    }

    await deleteCalendarEvent(auth, eventId, calendarId, { sendUpdates });
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(error.code === 404 ? 404 : 500).json({ 
      error: 'Erreur lors de la suppression de l\'événement',
      message: error.message 
    });
  }
};

/**
 * Vérifie la disponibilité pour une plage horaire
 */
const checkAvailability = async (req, res) => {
  try {
    const { startTime, endTime, calendarId = 'primary' } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Paramètres manquants',
        message: 'Les paramètres startTime et endTime sont requis' 
      });
    }

    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ error: 'Échec de l\'authentification' });
    }

// Rechercher les événements dans cette plage horaire
const events = await getAllCalendarEvents(auth, calendarId, {
  timeMin: new Date(startTime).toISOString(),
  timeMax: new Date(endTime).toISOString(),
  singleEvents: true
});
console.log('Events returned:', events);

// Si aucun événement trouvé, la plage horaire est disponible
const isAvailable = Array.isArray(events) ? events.length === 0 : true;
res.status(200).json({ 
  available: isAvailable,
  conflictingEvents: isAvailable ? [] : events
});
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la vérification de disponibilité',
      message: error.message 
    });
  }
};

/**
 * Liste tous les calendriers disponibles
 */
const getCalendars = async (req, res) => {
  try {
    const auth = await authorize();
    if (!auth) {
      return res.status(401).json({ error: 'Échec de l\'authentification' });
    }

    const calendars = await listCalendars(auth);
    
    res.status(200).json({ calendars });
  } catch (error) {
    console.error('Erreur lors de la récupération des calendriers:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des calendriers',
      message: error.message 
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  checkAvailability,
  getCalendars
};