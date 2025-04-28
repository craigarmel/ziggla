/**
 * Fichier: src/routes/calendarRoutes.js
 * Description: Routes pour les opérations du calendrier
 */

const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  checkAvailability,
  getCalendars
} = require('../controllers/calendarController');
// const {
//   // authCheck,
//   // googleAuthCheck,
//   // validateEventData
// } = require('../middleware');

// Route pour obtenir tous les calendriers
router.get('/calendars', getCalendars);

// Routes pour les événements
router.get('/events',  getEvents);
router.get('/events/:eventId',  getEvent);
router.post('/events', createEvent);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId',  deleteEvent);

// Route pour vérifier la disponibilité
router.post('/availability',  checkAvailability);

// Exporter le routeur
module.exports = router;

