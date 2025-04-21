import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';

const PropertyAmenities = ({ propertyId }) => {
  const { properties, amenities, loading } = usePropertyContext();
  
  // Trouver la propriété correspondante
  const property = properties.find(p => p._id === propertyId);
  
  if (loading || !property) {
    return <div className="property-amenities-loading">Chargement des équipements...</div>;
  }
  
  // Récupérer les équipements de la propriété si disponibles
  const propertyAmenities = property.features || [];
  
  if (propertyAmenities.length === 0) {
    return (
      <div className="property-amenities-empty">
        <p>Aucun équipement n'est listé pour cette propriété.</p>
      </div>
    );
  }
  
  return (
    <div className="property-amenities">
      <h3>Équipements et services</h3>
      <div className="amenities-grid">
        {propertyAmenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <span className="amenity-icon">✓</span>
            <span className="amenity-name">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenities;