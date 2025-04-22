// Dans googleCalendar.js
const { google } = require('googleapis');

// Configuration du client Google Calendar
const setupCalendarClient = () => {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );
    
    return google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('Erreur lors de la configuration du client Google Calendar:', error);
    throw new Error('Erreur de configuration Google Calendar');
  }
};

// Vérifier si le client Google Calendar peut être initialisé
const testGoogleCalendarConnection = async () => {
    try {
      const calendar = setupCalendarClient();
      const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
      
      // Test simple pour vérifier la connexion - liste les calendriers au lieu d'en récupérer un spécifique
      const response = await calendar.calendarList.list({
        maxResults: 10
      });
      
      console.log('Connexion à Google Calendar réussie');
      console.log('Calendriers disponibles:', response.data.items.map(cal => ({
        id: cal.id,
        summary: cal.summary
      })));
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion à Google Calendar:', error);
      return false;
    }
  };

module.exports = {
  setupCalendarClient,
  testGoogleCalendarConnection,
  // Autres fonctions...
};