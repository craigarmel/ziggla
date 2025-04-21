import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import TestimonialSection from '../components/home/TestimonialSection';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <TestimonialSection />
      
      {/* Section "Pourquoi nous choisir" */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-800">
              Pourquoi choisir Ziggla Luxury
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chez nous, l'expérience va bien au-delà d'un simple séjour.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
              <div className="bg-ocean-blue-100 text-ocean-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-gray-800">Luxe et Élégance</h3>
              <p className="text-gray-600">
                Chaque propriété est méticuleusement conçue pour offrir une expérience de luxe authentique, avec des finitions haut de gamme et une attention aux détails.
              </p>
            </div>
            
            {/* Carte 2 */}
            <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
              <div className="bg-ocean-blue-100 text-ocean-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-gray-800">Emplacement Prime</h3>
              <p className="text-gray-600">
                Nos propriétés sont situées dans les quartiers les plus recherchés de Londres, à proximité des attractions culturelles et des commodités essentielles.
              </p>
            </div>
            
            {/* Carte 3 */}
            <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
              <div className="bg-ocean-blue-100 text-ocean-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-gray-800">Personnalisation</h3>
              <p className="text-gray-600">
                Nous adaptons chaque séjour à vos besoins spécifiques, avec des services sur mesure pour créer une expérience véritablement personnalisée.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Prêt à vivre l'expérience Ziggla?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Réservez dès maintenant et découvrez pourquoi nos clients reviennent année après année. Une expérience inoubliable vous attend.
          </p>
          <Link to="/properties">
            <Button variant="gold" className="text-lg px-10 py-3">
              Réserver maintenant
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;