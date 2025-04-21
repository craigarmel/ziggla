import { useState } from 'react';
import Button from '../common/Button';

const PropertySearch = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');

  // Calculer la date minimum pour le checkin (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  
  // Calculer la date minimum pour le checkout (jour après checkin)
  const minCheckoutDate = checkin ? new Date(new Date(checkin).getTime() + 86400000).toISOString().split('T')[0] : today;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchParams = {
      location,
      checkin: checkin || undefined,
      checkout: checkout || undefined,
      guests: guests || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      propertyType: propertyType || undefined
    };
    
    // Filtrer les paramètres avec des valeurs vides
    const filteredParams = Object.entries(searchParams)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    onSearch(filteredParams);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Emplacement */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              id="location"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
              placeholder="Londres, Fulham..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          {/* Dates */}
          <div>
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-1">
              Arrivée
            </label>
            <input
              id="checkin"
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
              min={today}
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-1">
              Départ
            </label>
            <input
              id="checkout"
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
              min={minCheckoutDate}
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              disabled={!checkin}
            />
          </div>
          
          {/* Voyageurs */}
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Voyageurs
            </label>
            <select
              id="guests"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'voyageur' : 'voyageurs'}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-6 bg-gray-50 p-4 rounded-md">
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                Type de logement
              </label>
              <select
                id="propertyType"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="apartment">Appartement</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Prix minimum (£)
              </label>
              <input
                id="minPrice"
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Prix maximum (£)
              </label>
              <input
                id="maxPrice"
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            className="text-ocean-blue-600 hover:text-ocean-blue-800 font-medium text-sm flex items-center"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Moins de filtres
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Plus de filtres
              </>
            )}
          </button>
          
          <Button type="submit" variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Rechercher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearch;