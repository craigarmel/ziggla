import React, { useEffect, useState } from 'react';
import calendarService from '../../services/calendarService';

const CalendarAvailability = ({ propertyId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!propertyId) return;
      
      try {
        setLoading(true);
        
        // Obtenir le premier et dernier jour du mois courant
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        // Formater les dates pour l'API
        const startDate = firstDayOfMonth.toISOString().split('T')[0];
        const endDate = lastDayOfMonth.toISOString().split('T')[0];
        
        // Récupérer les événements pour ce mois
        const data = await calendarService.getEvents({
          propertyId,
          startDate,
          endDate
        });
        
        setEvents(data.events || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Impossible de charger le calendrier des disponibilités');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [propertyId, currentMonth]);
  
  // Navigation dans le calendrier
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Fonction pour générer le calendrier
  const renderCalendar = () => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    // Premier jour du mois
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    // Dernier jour du mois
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    // Jour de la semaine du premier jour (0-6, 0 = dimanche)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    // Nombre total de jours dans le mois
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Tableau pour stocker les dates occupées
    const occupiedDates = {};
    events.forEach(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      
      // Parcourir toutes les dates entre le début et la fin
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        // Vérifier que la date est dans le mois actuel
        if (d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()) {
          occupiedDates[d.getDate()] = true;
        }
      }
    });
    
    // Créer le tableau de jours pour l'affichage
    const calendarDays = [];
    
    // Ajouter les jours vides au début
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && 
                       new Date().getMonth() === currentMonth.getMonth() && 
                       new Date().getFullYear() === currentMonth.getFullYear();
                       
      const isOccupied = occupiedDates[day];
      
      calendarDays.push(
        <div 
          key={`day-${day}`} 
          className={`
            h-10 w-10 flex items-center justify-center rounded-full
            ${isToday ? 'bg-blue-100 font-bold' : ''}
            ${isOccupied ? 'bg-red-100 text-red-800 line-through' : 'hover:bg-gray-100'}
          `}
          title={isOccupied ? 'Jour non disponible' : 'Jour disponible'}
        >
          {day}
        </div>
      );
    }
    
    return (
      <div className="calendar-container">
        <div className="calendar-header flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h4 className="font-medium text-lg">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="calendar-days-names grid grid-cols-7 gap-1 mb-1">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-days grid grid-cols-7 gap-1">
          {calendarDays}
        </div>
        
        <div className="calendar-legend mt-4 flex items-center text-sm">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-red-100 rounded-full mr-1"></div>
            <span>Non disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 rounded-full mr-1"></div>
            <span>Aujourd'hui</span>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <div className="text-center py-4">Chargement du calendrier...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="calendar-availability bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-serif font-bold mb-6">Calendrier des disponibilités</h3>
      
      {renderCalendar()}
      
      {events.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Périodes déjà réservées:</h4>
          <ul className="space-y-1 text-sm">
            {events.map((event, index) => {
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);
              const options = { day: 'numeric', month: 'long' };
              
              return (
                <li key={index} className="text-red-600">
                  Du {startDate.toLocaleDateString('fr-FR', options)} au {endDate.toLocaleDateString('fr-FR', options)}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarAvailability;