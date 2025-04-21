const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes
const protect = async (req, res, next) => {
  let token;
  
  // Vérifier si le token est dans les en-têtes
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token du header
      token = req.headers.authorization.split(' ')[1];
      
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Récupérer l'utilisateur sans le mot de passe
      req.user = await User.findById(decoded.id).select('-passwordHash');
      
      next();
    } catch (error) {
      console.error('Erreur de token:', error);
      res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Non autorisé, aucun token' });
  }
};

// Middleware pour vérifier le rôle admin
const admin = (req, res, next) => {
  // Vérifier selon les deux méthodes (role ou isAdmin) pour plus de compatibilité
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    next();
  } else {
    res.status(403).json({ message: 'Non autorisé, accès réservé aux administrateurs' });
  }
};

module.exports = { protect, admin };