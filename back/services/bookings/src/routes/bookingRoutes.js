// /back/services/bookings/src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const {
  getBookings,
  getUserBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.get('/my-bookings', getUserBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking);

router.put('/:id/cancel', cancelBooking);

module.exports = router;