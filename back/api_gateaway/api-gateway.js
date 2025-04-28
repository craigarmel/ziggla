// // api-gateway.js - Version ultra-simplifiée
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware de base
// app.use(cors());
// app.use(express.json());

// // Route d'accueil
// app.get('/', (req, res) => {
//   res.json({ message: 'API Gateway opérationnelle' });
// });

// // Définition des routes vers les services
// // Service d'authentification (port 4001)
// app.all('/auth/*', async (req, res) => {
//   await forwardRequest('http://localhost:4001', req, res);
// });

// app.all('/login', async (req, res) => {
//   await forwardRequest('http://localhost:4001', req, res);
// });

// app.all('/register', async (req, res) => {
//   await forwardRequest('http://localhost:4001', req, res);
// });

// app.all('/logout', async (req, res) => {
//   await forwardRequest('http://localhost:4001', req, res);
// });

// // Service utilisateurs (port 4002)
// app.all('/users/*', async (req, res) => {
//   await forwardRequest('http://localhost:4002', req, res);
// });

// app.all('/profile', async (req, res) => {
//   await forwardRequest('http://localhost:4002', req, res);
// });

// // Service produits (port 4003)
// app.all('/products/*', async (req, res) => {
//   await forwardRequest('http://localhost:4003', req, res);
// });

// app.all('/categories/*', async (req, res) => {
//   await forwardRequest('http://localhost:4003', req, res);
// });

// // Service commandes (port 4004)
// app.all('/orders/*', async (req, res) => {
//   await forwardRequest('http://localhost:4004', req, res);
// });

// app.all('/cart/*', async (req, res) => {
//   await forwardRequest('http://localhost:4004', req, res);
// });

// // Service paiement (port 4005)
// app.all('/payment/*', async (req, res) => {
//   await forwardRequest('http://localhost:4005', req, res);
// });

// app.all('/checkout/*', async (req, res) => {
//   await forwardRequest('http://localhost:4005', req, res);
// });

// // Service notification (port 4006)
// app.all('/notifications/*', async (req, res) => {
//   await forwardRequest('http://localhost:4006', req, res);
// });

// // Fonction utilitaire pour transmettre les requêtes
// async function forwardRequest(serviceUrl, req, res) {
//   const targetUrl = `${serviceUrl}${req.url}`;
  
//   try {
//     const response = await axios({
//       method: req.method,
//       url: targetUrl,
//       data: req.body,
//       headers: {
//         'Content-Type': 'application/json',
//         ...req.headers
//       },
//       validateStatus: () => true // Pour gérer tous les codes d'état
//     });
    
//     // Renvoyer la réponse au client
//     res.status(response.status).json(response.data);
//   } catch (error) {
//     console.error(`Erreur lors de la transmission de la requête vers ${targetUrl}:`, error.message);
//     res.status(500).json({ 
//       error: 'Erreur de communication avec le service',
//       details: error.message
//     });
//   }
// }

// // Gestion des routes non trouvées
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route non trouvée' });
// });

// // Démarrage du serveur
// app.listen(PORT, () => {
//   console.log(`API Gateway en cours d'exécution sur le port ${PORT}`);
// });