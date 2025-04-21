const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application
const app = express();

// Middleware pour le parsing du body
app.use(express.json());

// Middleware pour les requêtes cross-origin
app.use(cors());

// Logger en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ziggla-reservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connexion à MongoDB établie');
})
.catch(err => {
  console.error('Erreur de connexion MongoDB:', err.message);
});

// Routes
const propertyRoutes = require('./routes/propertiesRoutes');
app.use('/api/properties', propertyRoutes);

// Route racine
app.get('/', (req, res) => {
  res.send('API du service de propriétés est en ligne');
});

// Middleware pour la gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion des erreurs non interceptées
process.on('unhandledRejection', (err) => {
  console.log(`Erreur: ${err.message}`);
  console.log('Arrêt du serveur...');
  server.close(() => process.exit(1));
});