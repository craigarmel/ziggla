import { useState } from 'react';

// Données fictives pour les témoignages
const testimonials = [
  {
    id: 1,
    name: 'Sophie Marceau',
    location: 'Paris, France',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    rating: 5,
    text: 'Mon séjour chez Ziggla a été absolument exceptionnel. Le spa privé était divin et la vue sur Londres à couper le souffle. Je reviendrai certainement pour mon prochain voyage à Londres!'
  },
  {
    id: 2,
    name: 'James Wilson',
    location: 'New York, USA',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'En tant que voyageur d\'affaires fréquent, je cherche toujours des logements qui allient confort et praticité. Ziggla a dépassé toutes mes attentes. La connexion Wi-Fi rapide et l\'emplacement central étaient parfaits pour mes besoins.'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    location: 'Barcelona, Spain',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    rating: 4,
    text: 'Nous avons célébré notre anniversaire de mariage à Ziggla et c\'était un choix parfait. L\'appartement était luxueux, propre et incroyablement confortable. Le jacuzzi était la cerise sur le gâteau!'
  }
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-16 bg-ocean-blue-700 text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Des expériences inoubliables qui font revenir nos clients, encore et encore.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Card */}
          <div className="bg-white text-gray-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <img 
                src={testimonials[activeIndex].avatar} 
                alt={testimonials[activeIndex].name}
                className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gold-500"
              />
              <div>
                <h3 className="font-bold text-lg">{testimonials[activeIndex].name}</h3>
                <p className="text-gray-600">{testimonials[activeIndex].location}</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-gold-500' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            <blockquote className="text-gray-700 text-lg italic mb-4">
              "{testimonials[activeIndex].text}"
            </blockquote>
            
            {/* Dots indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-ocean-blue-600' : 'bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;