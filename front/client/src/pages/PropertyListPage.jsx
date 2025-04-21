import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useProperties from '../hooks/useProperties';
import PropertySearch from '../components/properties/PropertySearch';
import PropertyCard from '../components/properties/PropertyCard';
import Loader from '../components/common/Loader';

const PropertyListPage = () => {
  const location = useLocation();
  const { properties, loading, error, loadProperties, searchProperties } = useProperties();
  const [searchParams, setSearchParams] = useState({});
  
  // Récupérer les paramètres de recherche depuis l'URL si disponibles
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const params = {};
    
    // Extraire tous les paramètres de l'URL
    for (const [key, value] of query.entries()) {
      params[key] = value;
    }
    
    // Si des paramètres existent, effectuer une recherche
    if (Object.keys(params).length > 0) {
      setSearchParams(params);
      searchProperties(params);
    } else {
      // Sinon, charger toutes les propriétés
      loadProperties();
    }
  }, [location.search, loadProperties, searchProperties]);

  // Gérer la soumission du formulaire de recherche
  const handleSearch = (params) => {
    setSearchParams(params);
    searchProperties(params);
    
    // Mettre à jour l'URL avec les paramètres de recherche
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      query.set(key, value);
    });
    
    // Remplacer l'URL actuelle sans recharger la page
    window.history.replaceState({}, '', `${location.pathname}?${query.toString()}`);
  };

  // Générer un titre dynamique en fonction des paramètres de recherche
  const generateTitle = () => {
    if (Object.keys(searchParams).length === 0) {
      return "Toutes nos propriétés";
    }
    
    let title = "Propriétés";
    
    if (searchParams.location) {
      title += ` à ${searchParams.location}`;
    }
    
    if (searchParams.checkin && searchParams.checkout) {
      const checkin = new Date(searchParams.checkin);
      const checkout = new Date(searchParams.checkout);
      
      // Formater les dates en français
      const options = { day: 'numeric', month: 'long' };
      const checkinStr = checkin.toLocaleDateString('fr-FR', options);
      const checkoutStr = checkout.toLocaleDateString('fr-FR', options);
      
      title += ` du ${checkinStr} au ${checkoutStr}`;
    }
    
    if (searchParams.guests) {
      title += ` pour ${searchParams.guests} ${parseInt(searchParams.guests) === 1 ? 'personne' : 'personnes'}`;
    }
    
    return title;
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Barre de recherche */}
        <div className="mb-8">
          <PropertySearch onSearch={handleSearch} />
        </div>
        
        {/* Titre et résultats */}
        <h1 className="text-3xl font-serif font-bold mb-6">
          {generateTitle()}
        </h1>
        
        {/* Afficher le nombre de résultats */}
        {!loading && !error && (
          <p className="text-gray-600 mb-6">
            {properties.length} {properties.length === 1 ? 'propriété trouvée' : 'propriétés trouvées'}
          </p>
        )}
        
        {/* Indicateur de chargement */}
        {loading && <Loader size="large" color="ocean-blue" />}
        
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
            <h3 className="font-bold mb-2">Une erreur est survenue</h3>
            <p>{error}</p>
          </div>
        )}
        
        {/* Liste des propriétés */}
        {!loading && !error && properties.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Aucune propriété trouvée</h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche pour trouver plus de résultats.
            </p>
          </div>
        )}
        
        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListPage;