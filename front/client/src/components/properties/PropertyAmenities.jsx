import React from 'react';

// Map des icônes pour les équipements courants
const amenityIcons = {
  wifi: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.246-3.905 14.15 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  jacuzzi: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a7 7 0 11-14 0 7 7 0 0114 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  tv: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  kitchen: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  parking: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  // Icône par défaut
  default: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
};

// Fonction pour obtenir l'icône correspondant à un équipement
const getAmenityIcon = (amenity) => {
  // Convertir en minuscules et retirer les espaces pour la recherche
  const normalizedAmenity = amenity.toLowerCase().replace(/\s+/g, '');
  
  // Vérifier si l'équipement contient des mots-clés connus
  if (normalizedAmenity.includes('wifi') || normalizedAmenity.includes('internet')) {
    return amenityIcons.wifi;
  } else if (normalizedAmenity.includes('jacuzzi') || normalizedAmenity.includes('spa') || normalizedAmenity.includes('bain')) {
    return amenityIcons.jacuzzi;
  } else if (normalizedAmenity.includes('tv') || normalizedAmenity.includes('télé')) {
    return amenityIcons.tv;
  } else if (normalizedAmenity.includes('cuisine') || normalizedAmenity.includes('kitchen')) {
    return amenityIcons.kitchen;
  } else if (normalizedAmenity.includes('parking') || normalizedAmenity.includes('garage')) {
    return amenityIcons.parking;
  }
  
  // Par défaut
  return amenityIcons.default;
};

const PropertyAmenities = ({ amenities, propertyId }) => {
  // Fonction pour normaliser les données d'équipements selon différentes structures
  const normalizeAmenities = () => {
    // Si amenities est un tableau, l'utiliser directement
    if (Array.isArray(amenities) && amenities.length > 0) {
      return amenities;
    }
    
    // Si amenities est un objet avec une propriété éventuelle 'features' ou 'list'
    if (amenities && typeof amenities === 'object') {
      if (Array.isArray(amenities.features)) return amenities.features;
      if (Array.isArray(amenities.list)) return amenities.list;
      if (Array.isArray(amenities.items)) return amenities.items;
      
      // Convertir l'objet en tableau si nécessaire
      if (Object.keys(amenities).length > 0) {
        return Object.keys(amenities).filter(key => amenities[key] === true);
      }
    }
    
    // En dernier recours, retourner un tableau vide
    return [];
  };
  
  // Normaliser les équipements
  const normalizedAmenities = normalizeAmenities();
  
  // Si aucun équipement n'est disponible
  if (normalizedAmenities.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-center">
        <p className="text-gray-500">Aucun équipement n'est listé pour cette propriété.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {normalizedAmenities.map((amenity, index) => {
        // S'assurer que amenity est une chaîne de caractères
        const amenityName = typeof amenity === 'string' 
          ? amenity 
          : (amenity.name || amenity.label || `Équipement ${index + 1}`);
          
        return (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
            <div className="text-ocean-blue-600 mr-3">
              {getAmenityIcon(amenityName)}
            </div>
            <span className="text-gray-700">{amenityName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyAmenities;