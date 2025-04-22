// /back/services/bookings/src/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Property'
  },
  checkInDate: {
    type: Date,
    required: [true, 'Please provide a check-in date']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please provide a check-out date']
  },
  guestsCount: {
    type: Number,
    required: [true, 'Please provide the number of guests']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please provide the total price']
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  depositRefunded: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'partial'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'PayPal'
  },
  transactionId: {
    type: String,
    default: null
  },
  specialRequests: {
    type: String,
    default: null
  },
  cancellationReason: {
    type: String,
    default: null
  },
  cancellationDate: {
    type: Date,
    default: null
  },
  googleCalendarEventId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);