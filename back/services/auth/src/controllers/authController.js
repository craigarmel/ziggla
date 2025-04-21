const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  
  try {
    console.log('Données reçues pour l\'inscription:', { firstName, lastName, email, username, passwordProvided: !!password });
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
    }
    
    // Créer un nouvel utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password, // Le hook pre-save va hasher ce mot de passe
      username: username || email.split('@')[0],
      isActive: true,
      role: 'user',
      isAdmin: false
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
      console.log('Nouvel utilisateur créé:', {
        id: user._id,
        email: user.email,
        firstName: user.firstName
      });
    } else {
      res.status(400).json({ message: 'Données utilisateur invalides' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Détails masqués en production'
    });
  }
};

// @desc    Authentification d'un utilisateur & obtention du token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    console.log('Tentative de connexion pour:', email);
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email }).select('+passwordHash');
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);
    
    if (isMatch) {
      // Mettre à jour la date de dernière connexion
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
      
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
      console.log('Utilisateur connecté:', {
        id: user._id,
        email: user.email,
        firstName: user.firstName
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Détails masqués en production'
    });
  }
};

// @desc    Récupérer le profil de l'utilisateur
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        loyaltyPoints: user.loyaltyPoints || 0,
        preferredLanguage: user.preferredLanguage || 'fr'
      });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération du profil',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Détails masqués en production'
    });
  }
};

// @desc    Vérifier si le token est valide
// @route   GET /api/auth/validate
// @access  Private
const validateToken = async (req, res) => {
  res.status(200).json({ 
    valid: true, 
    user: {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      isAdmin: req.user.isAdmin
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  validateToken
};