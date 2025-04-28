import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  if (!property) return null;

  const {
    _id,
    name,
    pricing,
    images,
    bedroomCount,
    bathroomCount,
    surfaceArea,
    location,
    type,
    isActive,
  } = property;

  const city = location?.city || 'Emplacement non spécifié';
  const country = location?.country || '';
  const mainImage =
    images && images.length > 0
      ? images.find((img) => img.isMain) || images[0]
      : { url: '/assets/default-property.jpg' };

  const price = pricing?.basePrice || 0;
  const currency = pricing?.currency || '€';

  return (
    <div className="property-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/property/${_id}`} className="block">
        <div className="property-image relative h-48 w-full overflow-hidden">
          <img
            src={mainImage.url}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
            {isActive ? 'Actif' : 'Inactif'}
          </div>
        </div>

        <div className="property-content p-4">
          <h3 className="property-title text-lg font-bold mb-1 truncate">{name}</h3>

          <p className="property-location text-sm text-gray-500 mb-2">
            {city}
            {country ? `, ${country}` : ''}
          </p>

          <div className="property-features flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
            <span>{bedroomCount || 0} chambres</span>
            <span>{bathroomCount || 0} sdb</span>
            <span>{surfaceArea || 0} m²</span>
            <span>{type || 'Non spécifié'}</span>
          </div>

          <div className="property-price text-xl font-semibold text-indigo-600">
            {typeof price === 'number' ? price.toLocaleString() : price} {currency}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;