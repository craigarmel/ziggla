import { Link } from 'react-router-dom';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Image de fond avec overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          opacity: '0.6'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      
      {/* Contenu */}
      <div className="container-custom relative py-24 md:py-36 lg:py-48">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Bienvenue chez <span className="text-gold-400">Ziggla Luxury</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Découvrez l'élégance du confort dans nos propriétés de luxe au cœur de Londres.
            Une expérience incomparable vous attend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/properties">
              <Button variant="gold" className="text-lg px-8 py-3">
                Découvrir nos propriétés
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" className="text-lg px-8 py-3 border-white text-white hover:bg-white/10">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Forme décorative */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#f8fafc" fillOpacity="1" d="M0,128L60,144C120,160,240,192,360,186.7C480,181,600,139,720,128C840,117,960,139,1080,144C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;