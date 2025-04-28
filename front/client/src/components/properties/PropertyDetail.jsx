import { useEffect } from 'react';
import PropertyGallery from './PropertyGallery';
import PropertyAmenities from './PropertyAmenities';
import PropertyBookingForm from './PropertyBookingForm';
import ErrorBoundary from '../common/errorBoundary';
import CalendarAvailability from './CalendarAvailability';

const PropertyDetail = ({ property }) => {
  useEffect(() => {
    // Scroll to top when property changes
    window.scrollTo(0, 0);
  }, [property?._id]);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Propriété non trouvée</h2>
          <p className="text-gray-600">
            La propriété que vous recherchez n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  // Fonction personnalisée pour afficher une erreur dans le formulaire de réservation
  const bookingFormFallback = (error, errorInfo, reset) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-serif font-bold mb-4 text-red-800">
        Impossible de charger le formulaire de réservation
      </h3>
      <p className="text-gray-700 mb-4">
        Nous rencontrons actuellement des difficultés pour afficher le formulaire de réservation.
        Veuillez réessayer plus tard ou nous contacter directement.
      </p>
      <button 
        onClick={reset}
        className="px-4 py-2 bg-ocean-blue-600 text-white rounded-md hover:bg-ocean-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="container-custom py-8">
      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-gray-800">
        {property.name}
      </h1>
      
      {/* Localisation */}
        <div className="flex items-center text-gray-600 mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {property.location?.address || property.address?.address || property.city || ''}
            {property.location?.postalCode || property.address?.postalCode || property.postalCode ? ', ' : ''}
            {property.location?.postalCode || property.address?.postalCode || property.postalCode || ''}
            {property.location?.city || property.address?.city || property.city ? ', ' : ''}
            {property.location?.city || property.address?.city || property.city || ''}
            {property.location?.country || property.address?.country || property.country ? ', ' : ''}
            {property.location?.country || property.address?.country || property.country || ''}
          </span>
        </div>
        
        {/* Galerie */}
      <div className="mb-8">
        <PropertyGallery images={property.images} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Détails de la propriété */}
        <div className="lg:col-span-2">
          {/* Informations principales */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Type</h3>
                <p className="text-gray-600">{property.type === 'apartment' ? 'Appartement' : (property.type === 'studio' ? 'Studio' : property.type || 'Non spécifié')}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Surface</h3>
                <p className="text-gray-600">{property.surfaceArea || 0} m²</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Chambres</h3>
                <p className="text-gray-600">{property.bedroomCount || 0}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Salles de bain</h3>
                <p className="text-gray-600">{property.bathroomCount || 0}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Capacité</h3>
                <p className="text-gray-600">{property.maxOccupancy || 2} personnes maximum</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Entrée</h3>
                <p className="text-gray-600">
                  {property.hasPrivateEntrance 
                    ? 'Entrée privée' 
                    : 'Entrée partagée'}
                  {property.floorNumber !== undefined && ` - ${property.floorNumber}${property.floorNumber === 1 ? 'er' : 'ème'} étage`}
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-serif font-bold mb-3">À propos</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {property.description || 'Aucune description disponible.'}
            </p>
          </div>
          
          {/* Aménités */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-serif font-bold mb-5">Équipements</h3>
            <ErrorBoundary>
              <PropertyAmenities amenities={property.amenities} />
            </ErrorBoundary>
          </div>
          
          {/* Points d'intérêt */}
          {property.pointsOfInterest && property.pointsOfInterest.length > 0 && (
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-xl font-serif font-bold mb-5">À proximité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.pointsOfInterest.map((poi, index) => (
                  <div key={index} className="flex items-start">
                    <div className="rounded-full bg-ocean-blue-100 p-2 mr-3">
                      <svg className="w-5 h-5 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {poi.type === 'stadium' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        ) : poi.type === 'airport' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        ) : poi.type === 'historic' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{poi.name}</h4>
                      <p className="text-sm text-gray-600">
                        {poi.distance && (
                          <span>
                            {typeof poi.distance === 'number' 
                              ? `${poi.distance} km` 
                              : poi.distance}
                            {poi.travelTime && ` - ${poi.travelTime} min ${poi.transportMode === 'walk' ? 'à pied' : 'en voiture'}`}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Règles de la maison */}
          {property.houseRules && (
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-xl font-serif font-bold mb-5">Règles de la maison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${property.houseRules.adultsOnly ? 'text-red-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>
                    {property.houseRules.adultsOnly 
                      ? `Réservé aux adultes (${property.houseRules.minAge || 18}+ ans)` 
                      : 'Adapté aux enfants'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${property.houseRules.petsAllowed ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>
                    {property.houseRules.petsAllowed 
                      ? 'Animaux acceptés' 
                      : 'Animaux non acceptés'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${!property.houseRules.smokingAllowed ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>
                    {property.houseRules.smokingAllowed 
                      ? 'Fumeur autorisé' 
                      : 'Non-fumeur'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${!property.houseRules.partiesAllowed ? 'text-red-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>
                    {property.houseRules.partiesAllowed 
                      ? 'Fêtes autorisées' 
                      : 'Fêtes interdites'}
                  </span>
                </div>
              </div>
              
              {/* Règles additionnelles */}
              {property.houseRules.additionalRules && property.houseRules.additionalRules.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Règles supplémentaires</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {property.houseRules.additionalRules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Caractéristiques de sécurité */}
          {property.securityFeatures && property.securityFeatures.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-bold mb-5">Caractéristiques de sécurité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {property.securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulaire de réservation et calendrier */}
        <div className="lg:col-span-1 space-y-6">
          <ErrorBoundary fallback={bookingFormFallback}>
            <PropertyBookingForm property={property} />
          </ErrorBoundary>
          
          {/* Calendrier des disponibilités */}
          <ErrorBoundary>
            <CalendarAvailability propertyId={property._id} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;