const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// Protège les routes
// In AuthMiddleware.js
exports.protect = asyncHandler(async (req, res, next) => {
    // ...token validation logic...
    
    try {
      // Verify token with auth service
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
      
      // Make sure this line is setting the user properly
      req.user = data.user;
      next();
    } catch (err) {
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