import { Link } from 'react-router-dom';
import Button from '../common/Button';

// Données fictives pour les propriétés en vedette
const featuredProperties = [
  {
    id: 1,
    title: 'Ziggla Luxury Apartments',
    description: 'Appartement spacieux avec vue panoramique sur Londres, équipé d\'un spa privé et d\'une cuisine complète.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
    price: '£110',
    features: ['200m²', 'Jacuzzi', 'Wi-Fi 66 Mb/s', 'Vue sur la ville']
  },
  {
    id: 2,
    title: 'Ziggla Luxury Properties',
    description: 'Studio élégant et moderne avec salle de bain luxueuse, parfait pour les séjours professionnels ou romantiques.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: '£105',
    features: ['200m²', 'Cuisine équipée', 'Salle de bain luxueuse', 'Près du stade']
  }
];

const FeaturedProperties = () => {
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
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-gold-500 text-white px-4 py-1 rounded-full font-medium">
                  {property.price}/nuit
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
                  {property.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-ocean-blue-50 text-ocean-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Link to={`/properties/${property.id}`}>
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