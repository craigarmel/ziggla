// Dans config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ziggla-reservation', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Tester si la connexion fonctionne en créant une collection temporaire
    try {
      await conn.connection.db.createCollection('test_connection');
      // console.log('Test de connexion réussi : création de collection OK');
      await conn.connection.db.dropCollection('test_connection');
    } catch (testError) {
      console.error('Test de connexion échoué:', testError);
    }
  } catch (error) {
    console.error(`Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;