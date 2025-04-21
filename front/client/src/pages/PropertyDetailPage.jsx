import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProperties from '../hooks/useProperties';
import PropertyDetail from '../components/properties/PropertyDetail';
import Loader from '../components/common/Loader';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { property, loading, error, loadProperty } = useProperties();

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id, loadProperty]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b">
        <div className="container-custom py-4 text-sm">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-500 hover:text-ocean-blue-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Accueil
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link to="/properties" className="text-gray-500 hover:text-ocean-blue-600 ml-1 md:ml-2">
                    Propriétés
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium truncate" title={property?.name}>
                    {loading ? 'Chargement...' : (property?.name || 'Propriété')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="container-custom py-8">
        {/* Indicateur de chargement */}
        {loading && <Loader size="large" color="ocean-blue" />}
        
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
            <h3 className="font-bold mb-2">Une erreur est survenue</h3>
            <p>{error}</p>
            <Link to="/properties" className="mt-4 inline-block text-ocean-blue-600 hover:underline">
              Retourner à la liste des propriétés
            </Link>
          </div>
        )}
        
        {/* Détails de la propriété */}
        {!loading && !error && property && (
          <PropertyDetail property={property} />
        )}
        
        {/* Propriété non trouvée */}
        {!loading && !error && !property && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">Propriété non trouvée</h2>
            <p className="text-gray-600 mb-6">
              La propriété que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Link to="/properties" className="btn-primary">
              Voir toutes les propriétés
            </Link>
          </div>
        )}
      </div>
      
      {/* Section "Autres propriétés" - à implémenter plus tard */}
    </div>
  );
};

export default PropertyDetailPage;