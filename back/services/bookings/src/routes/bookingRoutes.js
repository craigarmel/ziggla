// /back/services/bookings/src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getBookings,
  getUserBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');

router.route('/')
  .get(protect, authorize('admin'), getBookings)
  .post(protect, createBooking);

router.get('/my-bookings', protect, getUserBookings);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking);

router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;