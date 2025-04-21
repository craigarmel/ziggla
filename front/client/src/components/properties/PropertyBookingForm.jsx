import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { useAuthContext } from '../../context/AuthContext';

const PropertyBookingForm = ({ propertyId }) => {
  const { getPropertyById, checkAvailability } = usePropertyContext();
  const { isAuthenticated, user } = useAuthContext();
  
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
      const result = await checkAvailability(propertyId, booking.startDate, booking.endDate);
      setAvailability(result);
      
      if (result.available) {
        setError(null);
      } else {
        setError('Cette propriété n\'est pas disponible aux dates sélectionnées.');
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
    
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const property = getPropertyById(propertyId);
    
    if (!property) return null;
    
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days * property.price;
  };
  
  const total = calculateTotal();
  
  return (
    <div className="property-booking-form">
      <h3>Réservez cette propriété</h3>
      
      {success ? (
        <div className="booking-success">
          <p>Votre demande de réservation a été envoyée avec succès!</p>
          <p>Le propriétaire vous contactera prochainement pour confirmer votre réservation.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="new-booking-btn"
          >
            Faire une nouvelle réservation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startDate">Date d'arrivée</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={booking.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">Date de départ</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={booking.endDate}
              onChange={handleChange}
              min={booking.startDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="guests">Nombre de personnes</label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={booking.guests}
              onChange={handleChange}
              min="1"
              max="20"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message au propriétaire (optionnel)</label>
            <textarea
              id="message"
              name="message"
              value={booking.message}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
          
          {total && (
            <div className="booking-total">
              <p>Total estimé: <strong>{total.toLocaleString()} €</strong></p>
            </div>
          )}
          
          {error && (
            <div className="booking-error">
              {error}
            </div>
          )}
          
          {availability && availability.available && (
            <div className="booking-available">
              Cette propriété est disponible aux dates sélectionnées!
            </div>
          )}
          
          <div className="booking-actions">
            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={isSubmitting || !booking.startDate || !booking.endDate}
              className="check-availability-btn"
            >
              {isSubmitting ? 'Vérification...' : 'Vérifier la disponibilité'}
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !availability || !availability.available || !isAuthenticated}
              className="submit-booking-btn"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Réserver maintenant'}
            </button>
          </div>
          
          {!isAuthenticated && (
            <div className="login-reminder">
              <p>Vous devez être <a href="/login">connecté</a> pour effectuer une réservation.</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default PropertyBookingForm;