// /back/services/bookings/src/controllers/bookingController.js
const Booking = require('../models/booking');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// Helper function to check availability
const checkAvailability = async (propertyId, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${process.env.CALENDAR_SERVICE_URL}/api/calendar/availability/${propertyId}`, {
        params: { startDate, endDate }
      }
    );
    
    return response.data.data.every(day => day.isAvailable);
  } catch (error) {
    console.error('Error checking availability:', error);
    throw new Error('Failed to check availability');
  }
};

// Helper function to create calendar event
const createCalendarEvent = async (bookingData) => {
  try {
    const response = await axios.post(
      `${process.env.CALENDAR_SERVICE_URL}/api/calendar/events`,
      bookingData
    );
    
    return response.data.eventId;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find();
  
  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user.id });
  
  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is booking owner or admin
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this booking`, 403));
  }
  
  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.id;
  
  const { propertyId, checkInDate, checkOutDate } = req.body;
  
  // Check if property is available for the requested dates
  const isAvailable = await checkAvailability(
    propertyId,
    checkInDate,
    checkOutDate
  );
  
  if (!isAvailable) {
    return next(new ErrorResponse('Property is not available for the requested dates', 400));
  }
  
  // Create booking
  const booking = await Booking.create(req.body);
  
  // Create event in Google Calendar
  try {
    // Fetch property and user details for the calendar event
    const property = await axios.get(`${process.env.PROPERTIES_SERVICE_URL}/api/properties/${propertyId}`);
    
    const calendarEventData = {
      propertyId: booking.propertyId,
      propertyName: property.data.data.title,
      bookingId: booking._id,
      guestId: booking.userId,
      guestName: `${req.user.firstName} ${req.user.lastName}`,
      guestEmail: req.user.email,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate
    };
    
    const eventId = await createCalendarEvent(calendarEventData);
    
    // Update booking with Google Calendar event ID
    booking.googleCalendarEventId = eventId;
    await booking.save();
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    // We continue even if calendar creation fails
  }
  
  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is booking owner or admin
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 403));
  }
  
  // If dates are changing, check availability
  if (req.body.checkInDate || req.body.checkOutDate) {
    const checkInDate = req.body.checkInDate || booking.checkInDate;
    const checkOutDate = req.body.checkOutDate || booking.checkOutDate;
    
    const isAvailable = await checkAvailability(
      booking.propertyId,
      checkInDate,
      checkOutDate
    );
    
    if (!isAvailable) {
      return next(new ErrorResponse('Property is not available for the requested dates', 400));
    }
  }
  
  // Update booking
  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const { cancellationReason } = req.body;
  
  let booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is booking owner or admin
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this booking`, 403));
  }
  
  // Check if booking can be cancelled (48 hours before check-in)
  const checkInDate = new Date(booking.checkInDate);
  const now = new Date();
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
  
  if (hoursUntilCheckIn < 48 && req.user.role !== 'admin') {
    return next(new ErrorResponse('Bookings can only be cancelled at least 48 hours before check-in', 400));
  }
  
  // Update booking status
  booking.status = 'cancelled';
  booking.cancellationReason = cancellationReason || 'No reason provided';
  booking.cancellationDate = Date.now();
  
  await booking.save();
  
  // Delete event from Google Calendar if exists
  if (booking.googleCalendarEventId) {
    try {
      await axios.delete(
        `${process.env.CALENDAR_SERVICE_URL}/api/calendar/events/${booking.googleCalendarEventId}`
      );
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      // Continue even if calendar deletion fails
    }
  }
  
  res.status(200).json({
    success: true,
    data: booking
  });
});