const Property = require('../models/Property');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Obtenir toutes les propriétés
// @route   GET /api/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find();
  
  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Obtenir une propriété par ID
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    return next(
      new ErrorResponse(`Propriété non trouvée avec l'id ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Créer une nouvelle propriété
// @route   POST /api/properties
// @access  Private
exports.createProperty = asyncHandler(async (req, res, next) => {
  // Dans un vrai système, vous récupéreriez l'ID de l'utilisateur à partir du token JWT
  // Pour la simplicité, nous allons le hardcoder
  req.body.ownerId = req.body.ownerId || '6001234567890abcdef12345'; // ID factice
  
  // Vérifier si les coordonnées sont fournies
  if (req.body.location && req.body.location.coordinates) {
    const { latitude, longitude } = req.body.location.coordinates;
    
    // Ajouter le format GeoJSON pour les recherches géospatiales
    req.body.location.geoLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
  }
  
  const property = await Property.create(req.body);
  
  res.status(201).json({
    success: true,
    data: property
  });
});

// @desc    Mettre à jour une propriété
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);
  
  if (!property) {
    return next(
      new ErrorResponse(`Propriété non trouvée avec l'id ${req.params.id}`, 404)
    );
  }
  
  // Vérifier si les coordonnées sont mises à jour
  if (req.body.location && req.body.location.coordinates) {
    const { latitude, longitude } = req.body.location.coordinates;
    
    // Mettre à jour le format GeoJSON
    req.body.location.geoLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
  }
  
  // Mise à jour des données
  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Supprimer une propriété
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    return next(
      new ErrorResponse(`Propriété non trouvée avec l'id ${req.params.id}`, 404)
    );
  }
  
  await property.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});