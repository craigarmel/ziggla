import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import useAuth from '../../hooks/useAuth';

const PropertyBookingForm = ({ property, propertyId }) => {
  // On utilise soit la propriété passée en props, soit on la récupère via l'ID
  const { isAuthenticated, user } = useAuth();
  const propertyContext = usePropertyContext();
  
  // Récupérer la propriété si elle n'est pas déjà fournie dans les props
  const propertyToUse = property || (propertyContext?.getPropertyById ? propertyContext.getPropertyById(propertyId) : null);
  
  // Si ni la propriété ni l'ID ne sont valides, on affiche un message d'erreur
  if (!propertyToUse && !property) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
        <h3 className="font-bold">Erreur de chargement</h3>
        <p>Impossible de charger les informations de cette propriété.</p>
      </div>
    );
  }
  
  const [booking, setBooking] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    message: ''
  });
  
  const [availability, setAvailability] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) : value
    }));
    
    // Réinitialiser les états d'erreur et de succès
    setError(null);
    setSuccess(false);
    setAvailability(null);
  };
  
  // Vérifier la disponibilité
  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    
    if (!booking.startDate || !booking.endDate) {
      setError('Veuillez sélectionner des dates d\'arrivée et de départ.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Vérifier si la fonction checkAvailability existe dans le contexte
      if (propertyContext?.checkAvailability) {
        const result = await propertyContext.checkAvailability(
          propertyToUse._id || propertyId, 
          booking.startDate, 
          booking.endDate
        );
        setAvailability(result);
        
        if (result.available) {
          setError(null);
        } else {
          setError('Cette propriété n\'est pas disponible aux dates sélectionnées.');
        }
      } else {
        // Simulation de disponibilité si l'API n'est pas disponible
        setAvailability({ available: true });
        setError(null);
      }
    } catch (err) {
      setError('Erreur lors de la vérification de disponibilité. Veuillez réessayer.');
      console.error('Erreur de disponibilité:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Soumettre la demande de réservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour effectuer une réservation.');
      return;
    }
    
    if (!booking.startDate || !booking.endDate) {
      setError('Veuillez sélectionner des dates d\'arrivée et de départ.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ici vous feriez un appel API pour créer la réservation
      // const result = await bookingService.createBooking({...booking, propertyId, userId: user.id});
      
      // Simuler un succès pour l'exemple
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setError(null);
      
      // Réinitialiser le formulaire
      setBooking({
        startDate: '',
        endDate: '',
        guests: 1,
        message: ''
      });
    } catch (err) {
      setError('Erreur lors de la création de la réservation. Veuillez réessayer.');
      console.error('Erreur de réservation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculer le prix total (exemple simplifié)
  const calculateTotal = () => {
    if (!booking.startDate || !booking.endDate) return null;
    if (!propertyToUse) return null;
    
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    
    // Récupérer le prix depuis la propriété
    let propertyPrice = 0;
    
    if (propertyToUse.price) {
      // Si le prix est directement disponible
      propertyPrice = propertyToUse.price;
    } else if (propertyToUse.pricing && propertyToUse.pricing.basePrice) {
      // Si le prix est dans un objet pricing
      propertyPrice = propertyToUse.pricing.basePrice;
    }
    
    if (!propertyPrice) return null;
    
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days * propertyPrice;
  };
  
  const total = calculateTotal();
  const currency = propertyToUse?.pricing?.currency || propertyToUse?.currency || '€';
  
  return (
    <div className="property-booking-form bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-serif font-bold mb-6">Réservez cette propriété</h3>
      
      {success ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
          <p className="font-medium">Votre demande de réservation a été envoyée avec succès!</p>
          <p className="mt-2">Le propriétaire vous contactera prochainement pour confirmer votre réservation.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Faire une nouvelle réservation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date d'arrivée
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={booking.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de départ
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={booking.endDate}
              onChange={handleChange}
              min={booking.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de personnes
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={booking.guests}
              onChange={handleChange}
              min="1"
              max={propertyToUse?.maxOccupancy || 20}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message au propriétaire (optionnel)
            </label>
            <textarea
              id="message"
              name="message"
              value={booking.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500"
            ></textarea>
          </div>
          
          {total && (
            <div className="p-4 bg-gray-50 rounded-md mb-4">
              <div className="flex justify-between font-medium">
                <span>Total estimé:</span>
                <span>{total.toLocaleString()} {currency}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Le prix définitif sera confirmé par le propriétaire.
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {availability && availability.available && (
            <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
              Cette propriété est disponible aux dates sélectionnées!
            </div>
          )}
          
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={isSubmitting || !booking.startDate || !booking.endDate}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isSubmitting ? 'Vérification...' : 'Vérifier la disponibilité'}
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !availability || !availability.available || !isAuthenticated}
              className="px-4 py-2 bg-ocean-blue-600 text-white rounded-md hover:bg-ocean-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Réserver maintenant'}
            </button>
          </div>
          
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md">
              <p>Vous devez être <a href="/login" className="underline font-medium">connecté</a> pour effectuer une réservation.</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default PropertyBookingForm;