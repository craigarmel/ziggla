const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const fetch = require('node-fetch');

// Protège les routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Vérifier si le token est dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Obtenir le token depuis Bearer token
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Obtenir le token depuis les cookies
    token = req.cookies.token;
  }
  
  // Vérifier si le token existe
  if (!token) {
    return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
  }
  
  try {
    // Vérifier si le token est valide avec le service d'authentification
    const verifyResponse = await fetch(`${process.env.AUTH_SERVICE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    const data = await verifyResponse.json();
    
    if (!data.success) {
      return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
    }
    
    req.user = data.user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
  }
});

// Autorisation par rôle
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`,
          403
        )
      );
    }
    next();
  };
};