// /back/services/calendar/src/models/Availability.js
const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Property'
  },
  date: {
    type: Date,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  customPrice: {
    type: Number,
    default: null
  },
  googleCalendarEventId: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  }
});

// Créer l'index pour garantir des combinaisons uniques propriété+date
AvailabilitySchema.index({ propertyId: 1, date: 1 }, { unique: true });

// Assurez-vous que cette ligne est présente et correcte
module.exports = mongoose.model('Availability', AvailabilitySchema);