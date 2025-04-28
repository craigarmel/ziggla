/**
 * Middleware pour formater les données de réservation en format d'événement Google Calendar
 */
const formatBookingToEvent = (req, res, next) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      notes,
      startTime,
      duration, // en minutes
      location
    } = req.body;

    // Calculer l'heure de fin basée sur la durée
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (parseInt(duration) * 60 * 1000));

    // Créer un résumé d'événement
    const summary = `Réservation: ${serviceType} - ${clientName}`;

    // Créer la description
    const description = `Client: ${clientName}
Email: ${clientEmail}
${clientPhone ? `Téléphone: ${clientPhone}` : ''}
Service: ${serviceType}
${notes ? `Notes: ${notes}` : ''}`;

    // Créer l'objet d'événement Google Calendar
    const event = {
      summary,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'Europe/Paris' // Utiliser le fuseau horaire approprié
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'Europe/Paris' // Utiliser le fuseau horaire approprié
      },
      attendees: [
        { email: clientEmail, displayName: clientName }
      ],
      // Stocker les informations de réservation dans les propriétés étendues
      extendedProperties: {
        private: {
          bookingInfo: JSON.stringify({
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            notes,
            duration
          })
        }
      },
      // Optionnel: ajouter une couleur spécifique pour les réservations
      colorId: '6', // Utiliser une couleur spécifique pour les réservations
      // Optionnel: ajouter des rappels
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // Rappel par email 24h avant
          { method: 'popup', minutes: 60 } // Rappel popup 1h avant
        ]
      }
    };

    // Si une localisation est spécifiée, l'ajouter à l'événement
    if (location) {
      event.location = location;
    }

    // Remplacer le corps de la requête par l'événement formaté
    req.body = event;
    next();
  } catch (error) {
    console.error('Erreur lors du formatage des données de réservation:', error);
    res.status(400).json({
      error: 'Erreur de formatage',
      message: 'Impossible de formater les données de réservation'
    });
  }
};