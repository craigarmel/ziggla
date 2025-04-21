const mongoose = require('mongoose');

// Schéma pour les coordonnées géographiques
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

// Schéma pour les images
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Veuillez ajouter une URL d\'image']
  },
  caption: {
    type: String
  },
  isMain: {
    type: Boolean,
    default: false
  }
});

// Schéma principal des propriétés
const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Veuillez ajouter un titre'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'Veuillez ajouter une description'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'Veuillez ajouter une ville']
    },
    zipCode: {
      type: String,
      required: [true, 'Veuillez ajouter un code postal']
    },
    country: {
      type: String,
      required: [true, 'Veuillez ajouter un pays']
    }
  },
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    geoLocation: pointSchema
  },
  price: {
    type: Number,
    required: [true, 'Veuillez ajouter un prix']
  },
  area: {
    type: Number,
    required: [true, 'Veuillez ajouter une superficie']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Veuillez indiquer le nombre de chambres']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Veuillez indiquer le nombre de salles de bain']
  },
  propertyType: {
    type: String,
    required: [true, 'Veuillez sélectionner un type de propriété'],
    enum: ['Appartement', 'Maison', 'Villa', 'Studio', 'Loft', 'Terrain']
  },
  status: {
    type: String,
    required: [true, 'Veuillez sélectionner un statut'],
    enum: ['À vendre', 'À louer', 'Vendu', 'Loué']
  },
  features: [String],
  images: [imageSchema],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche textuelle
PropertySchema.index({
  title: 'text',
  description: 'text',
  'address.city': 'text',
  'address.country': 'text'
});

// Index pour la recherche géospatiale
PropertySchema.index({ 'location.geoLocation': '2dsphere' });

module.exports = mongoose.model('Property', PropertySchema);