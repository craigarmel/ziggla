// /back/services/calendar/src/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const {
  getPropertyAvailability,
  updateAvailability,
  bulkUpdateAvailability
} = require('../controllers/availabilityControllers');
const { testGoogleCalendarConnection } = require('../utils/googleCalendar'); // Assurez-vous que le chemin est correct

// Dans calendarRoutes.js
router.get('/test-google-connection', async (req, res) => {
    try {
      const result = await testGoogleCalendarConnection();
      res.status(200).json({
        success: result,
        message: result ? 'Connexion à Google Calendar réussie' : 'Échec de la connexion à Google Calendar'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

router.get('/availability/:propertyId', getPropertyAvailability);
router.post('/availability/:propertyId', updateAvailability);
router.post('/availability/:propertyId/bulk', bulkUpdateAvailability);

module.exports = router;