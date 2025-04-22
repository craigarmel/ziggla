// /back/services/calendar/src/controllers/availabilityController.js
// Chemin absolu pour s'assurer que le modèle est correctement importé
const path = require('path');
const Availability = require(path.resolve(__dirname, '../models/Availability'));
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { checkAvailability } = require('../utils/googleCalendar');

// @desc    Get availability for a property
// @route   GET /api/calendar/availability/:propertyId
// @access  Public
exports.getPropertyAvailability = asyncHandler(async (req, res, next) => {
  const { propertyId } = req.params;
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return next(new ErrorResponse('Please provide start and end dates', 400));
  }
  
  // Get availability from database
  let availabilityRecords = [];
  try {
    availabilityRecords = await Availability.find({
      propertyId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });
  } catch (error) {
    console.error('Error fetching availability records:', error);
    // Continue with empty records
  }
  
  // Create a day-by-day availability map
  const start = new Date(startDate);
  const end = new Date(endDate);
  const availabilityMap = [];
  
  // Loop through each day and check availability
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Find availability record for this date
    const record = availabilityRecords.find(
      rec => rec.date.toISOString().split('T')[0] === dateString
    );
    
    // Add to availability map
    availabilityMap.push({
      date: dateString,
      isAvailable: record ? record.isAvailable : true,
      customPrice: record ? record.customPrice : null
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  res.status(200).json({
    success: true,
    data: availabilityMap
  });
});

// @desc    Update availability for a property
// @route   POST /api/calendar/availability/:propertyId
// @access  Private
exports.updateAvailability = asyncHandler(async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { startDate, endDate, isAvailable, customPrice } = req.body;
    
    console.log('Updating availability for property:', propertyId);
    console.log('Request body:', req.body);
    
    // Pour une seule date
    if (req.body.date) {
      const date = new Date(req.body.date);
      
      // Utiliser findOneAndUpdate avec upsert pour créer si n'existe pas
      const availability = await Availability.findOneAndUpdate(
        { propertyId, date },
        { 
          propertyId,
          date,
          isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
          customPrice: req.body.customPrice
        },
        { new: true, upsert: true }
      );
      
      return res.status(200).json({
        success: true,
        data: availability
      });
    }
    
    // Pour une plage de dates (bulk update)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Vérifier dates valides
      if (start > end) {
        return next(new ErrorResponse('La date de début doit être antérieure à la date de fin', 400));
      }
      
      // Créer une liste de toutes les dates dans la plage
      const dates = [];
      const currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Créer des opérations en masse
      const bulkOps = dates.map(date => ({
        updateOne: {
          filter: { propertyId, date },
          update: {
            propertyId,
            date,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            customPrice: customPrice
          },
          upsert: true
        }
      }));
      
      // Exécuter les opérations en masse
      await Availability.bulkWrite(bulkOps);
      
      return res.status(200).json({
        success: true,
        message: `Disponibilité mise à jour pour ${dates.length} jours`
      });
    }
    
    return next(new ErrorResponse('Veuillez fournir une date ou une plage de dates', 400));
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la disponibilité:', error);
    return next(new ErrorResponse(`Erreur serveur: ${error.message}`, 500));
  }
});

// @desc    Bulk update availability for a property
// @route   POST /api/calendar/availability/:propertyId/bulk
// @access  Private
exports.bulkUpdateAvailability = asyncHandler(async (req, res, next) => {
  const { propertyId } = req.params;
  const { startDate, endDate, isAvailable, customPrice } = req.body;
  
  if (!startDate || !endDate) {
    return next(new ErrorResponse('Please provide start and end dates', 400));
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Create an array of operations
  const operations = [];
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const date = new Date(currentDate);
    
    operations.push({
      updateOne: {
        filter: { propertyId, date },
        update: { 
          $set: { 
            propertyId,
            date,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            customPrice: customPrice !== undefined ? customPrice : null
          } 
        },
        upsert: true
      }
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Execute bulk operations
  await Availability.bulkWrite(operations);
  
  res.status(200).json({
    success: true,
    message: `Updated availability for ${operations.length} days`
  });
});