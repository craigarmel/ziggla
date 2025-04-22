const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// Protège les routes
exports.protect = asyncHandler(async (req, _res, next) => {
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
    const verifyResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/api/auth/verify`, {
      token
    });

    const data = verifyResponse.data;

    if (!data.valid) {
      return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
    }

    req.user = data.user || (data.decoded && data.decoded.user) || data.decoded || {};
    req.user.token = token;
    next();
  } catch (err) {
    console.error('Auth service error:', err.message);
    return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
  }
});

// Autorisation par rôle
exports.authorize = (...roles) => {
  return (req, res, next) => {
  return (req, _res, next) => {
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