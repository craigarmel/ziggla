import { Link } from 'react-router-dom';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden min-h-[70vh] flex items-center justify-center">
      {/* Image de fond avec overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          opacity: '0.6'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/40"></div>
      
      {/* Contenu */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center py-32 md:py-48 lg:py-64">
        <div className="max-w-3xl w-full mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-8 drop-shadow-2xl leading-tight">
            Bienvenue chez <span className="text-gold-400 drop-shadow-lg">Ziggla Luxury</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 font-light drop-shadow-lg">
            Découvrez l'élégance du confort dans nos propriétés de luxe au cœur de Londres.
            Une expérience incomparable vous attend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button className="text-lg px-8 py-3 shadow-xl hover:scale-105 transition-transform font-semibold">
                Découvrir nos propriétés
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="text-lg px-8 py-3 border-black text-gray-500 hover:bg-white/10 hover:text-gold-400 transition-colors shadow font-semibold">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;