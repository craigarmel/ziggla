import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const { _id, title, price, images, bedrooms, bathrooms, area, address, propertyType, status } = property;
  
  // Obtenir l'image principale ou une image par défaut
  const mainImage = images && images.length > 0 
    ? images.find(img => img.isMain) || images[0] 
    : { url: '/assets/default-property.jpg' };
  
  return (
    <div className="property-card">
      <Link to={`/property/${_id}`}>
        <div className="property-image">
          <img src={mainImage.url} alt={title} />
          <div className="property-status">{status}</div>
        </div>
        
        <div className="property-content">
          <h3 className="property-title">{title}</h3>
          
          <p className="property-location">
            {address.city}, {address.country}
          </p>
          
          <div className="property-features">
            <span>{bedrooms} chambres</span>
            <span>{bathrooms} sdb</span>
            <span>{area} m²</span>
            <span>{propertyType}</span>
          </div>
          
          <div className="property-price">
            {price.toLocaleString()} €
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;