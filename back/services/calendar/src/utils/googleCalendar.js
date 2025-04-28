/**
 * Fichier: googleCalendar.js
 * Description: Fonctions pour gérer les interactions avec l'API Google Calendar
 */

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { get } = require('http');

// Si vous modifiez ces étendues, supprimez token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// Le fichier token.json stocke les jetons d'accès et d'actualisation de l'utilisateur
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lit le fichier token précédemment autorisé, sinon autorise la demande.
 * @return {Promise<OAuth2Client|null>}
 */
async function authorize() {
  let client = null;
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    client = google.auth.fromJSON(credentials);
  } catch (err) {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: client._clientId,
        client_secret: client._clientSecret,
        refresh_token: client.credentials.refresh_token,
      });
      await fs.writeFile(TOKEN_PATH, payload);
    }
  }
  return client;
}

/**
 * Récupère tous les événements du calendrier
 * @param {google.auth.OAuth2} auth Un client OAuth2 authentifié
 * @param {string} calendarId ID du calendrier (utiliser 'primary' pour le calendrier principal)
 * @param {Object} options Options supplémentaires pour la requête
 * @return {Promise<Array>} Liste des événements
 */
async function getAllCalendarEvents(auth, calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary', options = {}) {
  const calendar = google.calendar({ version: 'v3', auth });
  const defaultOptions = {
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await calendar.events.list({
      calendarId: calendarId,
      ...mergedOptions
    });
    
    console.log(`Événements récupérés: ${response.data.items.length}`);
    return response.data.items;
  } catch (error) {
    console.error('Erreur dans getAllCalendarEvents:', error.message);
    if (error.response) {
      console.error('Détails de l\'erreur:', error.response.data);
    }
    throw error;
  }
}

/**
 * Crée un nouvel événement dans le calendrier
 * @param {google.auth.OAuth2} auth Un client OAuth2 authentifié
 * @param {Object} eventData Données de l'événement à créer
 * @param {string} calendarId ID du calendrier (utiliser 'primary' pour le calendrier principal)
 * @return {Promise<Object>} Événement créé
 */
async function createCalendarEvent(auth, eventData, calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary') {
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: eventData,
    });
    
    console.log('Événement créé:', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    if (error.response) {
      console.error('Détails de l\'erreur:', error.response.data);
    }
    throw error;
  }
}

/**
 * Liste tous les calendriers disponibles
 * @param {google.auth.OAuth2} auth Un client OAuth2 authentifié
 * @return {Promise<Array>} Liste des calendriers
 */
async function listCalendars(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    const response = await calendar.calendarList.list();
    return response.data.items;
  } catch (error) {
    console.error('Erreur lors de la récupération des calendriers:', error);
    throw error;
  }
}

/**
 * Met à jour un événement existant
 * @param {google.auth.OAuth2} auth Un client OAuth2 authentifié
 * @param {string} eventId ID de l'événement à mettre à jour
 * @param {Object} eventData Nouvelles données de l'événement
 * @param {string} calendarId ID du calendrier
 * @return {Promise<Object>} Événement mis à jour
 */
async function updateCalendarEvent(auth, eventId, eventData, calendarId = 'primary') {
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    const response = await calendar.events.update({
      calendarId: calendarId,
      eventId: eventId,
      resource: eventData,
      sendUpdates: eventData.sendUpdates || 'none'
    });
    
    console.log('Événement mis à jour:', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'événement ${eventId}:`, error);
    throw error;
  }
}

/**
 * Supprime un événement
 * @param {google.auth.OAuth2} auth Un client OAuth2 authentifié
 * @param {string} eventId ID de l'événement à supprimer
 * @param {string} calendarId ID du calendrier
 * @param {Object} options Options supplémentaires (sendUpdates, etc.)
 * @return {Promise<void>}
 */
async function deleteCalendarEvent(auth, eventId, calendarId = 'primary', options = {}) {
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
      ...options
    });
    
    console.log(`Événement ${eventId} supprimé`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'événement ${eventId}:`, error);
    throw error;
  }
}


//Get all events from calendar
async function getCalendarEvent(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
}

/**
 * Vérifie les conflits entre un nouvel événement et les événements existants
 * @param {google.auth.OAuth2} auth Un client OAuth2 authentifié
 * @param {string} startTime Heure de début
 * @param {string} endTime Heure de fin
 * @param {string} calendarId ID du calendrier
 * @return {Promise<boolean>} True si le créneau est libre, false sinon
 */
async function checkTimeSlotAvailability(auth, startTime, endTime, calendarId = 'primary') {
  try {
    const events = await getAllCalendarEvents(auth, calendarId, {
      timeMin: new Date(startTime).toISOString(),
      timeMax: new Date(endTime).toISOString(),
      singleEvents: true
    });
    
    return events.items.length === 0;
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    throw error;
  }
}

module.exports = {
  authorize,
  getAllCalendarEvents,
  getCalendarEvent,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  listCalendars,
  checkTimeSlotAvailability
};