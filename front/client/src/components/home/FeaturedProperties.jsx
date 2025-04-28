import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import propertyService from '../../services/propertyService';

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    propertyService.getAllProperties().then((properties) => {
      setFeaturedProperties(properties.slice(0, 2)); // Affiche les 2 premières propriétés
    });
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-800">
            Nos propriétés en vedette
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez nos espaces soigneusement conçus où le luxe rencontre le confort. 
            Chaque propriété raconte sa propre histoire d'élégance et de raffinement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={property.images[0]?.url || '/assets/default-property.jpg'} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-gold-500 text-white px-4 py-1 rounded-full font-medium">
                  {property.pricing.basePrice}/nuit
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold mb-2 text-gray-800">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {property.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {property.features && property.features.map((feature, index) => (
                    <span 
                      key={`${property.id}-feature-${index}`}
                      className="bg-ocean-blue-50 text-ocean-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Link to={`/property/${property._id}`}>
                  <Button variant="primary" fullWidth>
                    Voir les détails
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/properties">
            <Button variant="secondary">
              Voir toutes nos propriétés
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;