import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import PropertyCard from './PropertyCard';

const PropertyList = () => {
  const { properties, loading, error, refreshProperties, sortByPrice } = usePropertyContext();
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Filtre pour le type de propriété
  const [selectedType, setSelectedType] = useState('');
  const propertyTypes = ['Appartement', 'Maison', 'Villa', 'Studio', 'Loft', 'Terrain'];
  
  // Filtre pour le prix
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  
  // Charger les propriétés au montage du composant
  useEffect(() => {
    refreshProperties();
  }, []);
  
  // Gérer le tri par prix
  const handleSortByPrice = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortByPrice(newOrder === 'asc');
  };
  
  // Gérer le filtrage par type
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    if (e.target.value === '') {
      refreshProperties();
    } else {
      const { filterByType } = usePropertyContext();
      filterByType(e.target.value);
    }
  };
  
  // Gérer le filtrage par prix
  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    const { filterByPrice } = usePropertyContext();
    filterByPrice(min, max);
  };
  
  if (loading) return <div className="loading">Chargement des propriétés...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="properties-container">
      <div className="filters">
        <h3>Filtres</h3>
        
        {/* Filtre par type */}
        <div className="filter-group">
          <label htmlFor="property-type">Type de propriété:</label>
          <select 
            id="property-type" 
            value={selectedType} 
            onChange={handleTypeChange}
          >
            <option value="">Tous les types</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        {/* Filtre par prix */}
        <div className="filter-group">
          <label>Prix:</label>
          <div className="price-inputs">
            <input 
              type="number" 
              placeholder="Min" 
              value={priceRange.min}
              onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange.max)}
            />
            <span>à</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={priceRange.max}
              onChange={(e) => handlePriceChange(priceRange.min, parseInt(e.target.value))}
            />
          </div>
        </div>
        
        {/* Bouton de tri */}
        <button onClick={handleSortByPrice}>
          Trier par prix {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      
      {/* Liste des propriétés */}
      <div className="property-list">
        {properties.length === 0 ? (
          <p>Aucune propriété trouvée</p>
        ) : (
          properties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;