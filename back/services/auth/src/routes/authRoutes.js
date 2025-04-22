const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  validateToken,
  authenticateToken
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Routes publiques
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', authenticateToken, validateToken);

// Routes protégées
router.get('/profile', protect, getUserProfile);
router.get('/validate', protect, validateToken);

// Route de test pour admin
router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: 'Accès admin autorisé' });
});

module.exports = router;