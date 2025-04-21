import React, { useState } from 'react';

const PropertyGallery = ({ images = [], title = 'Propriété' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  // Si aucune image n'est fournie, afficher une image par défaut
  const hasImages = images && images.length > 0;
  const imagesList = hasImages ? images : [{ url: '/placeholder-property.jpg', caption: 'Image non disponible' }];
  
  const handlePrevious = () => {
    setActiveIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };
  
  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };
  
  const toggleFullscreen = () => {
    setShowFullscreen(prev => !prev);
  };
  
  return (
    <div className="property-gallery">
      <div className="main-image-container">
        <button 
          className="gallery-nav prev" 
          onClick={handlePrevious}
          aria-label="Image précédente"
        >
          &#10094;
        </button>
        
        <div className="main-image-wrapper">
          <img 
            src={imagesList[activeIndex].url} 
            alt={imagesList[activeIndex].caption || `${title} - Image ${activeIndex + 1}`}
            className="main-image"
            onClick={toggleFullscreen}
          />
          
          <button 
            className="fullscreen-toggle"
            onClick={toggleFullscreen}
            aria-label="Basculer en plein écran"
          >
            {showFullscreen ? '⤓' : '⤢'}
          </button>
        </div>
        
        <button 
          className="gallery-nav next" 
          onClick={handleNext}
          aria-label="Image suivante"
        >
          &#10095;
        </button>
      </div>
      
      {hasImages && imagesList.length > 1 && (
        <div className="thumbnails-container">
          {imagesList.map((image, index) => (
            <div 
              key={index}
              className={`thumbnail ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img 
                src={image.url} 
                alt={image.caption || `${title} - Miniature ${index + 1}`} 
              />
            </div>
          ))}
        </div>
      )}
      
      {imagesList[activeIndex].caption && (
        <div className="image-caption">
          {imagesList[activeIndex].caption}
        </div>
      )}
      
      {showFullscreen && (
        <div className="fullscreen-gallery" onClick={toggleFullscreen}>
          <div className="fullscreen-content" onClick={e => e.stopPropagation()}>
            <button 
              className="fullscreen-close"
              onClick={toggleFullscreen}
              aria-label="Fermer le plein écran"
            >
              &times;
            </button>
            
            <div className="fullscreen-navigation">
              <button 
                className="fullscreen-nav prev" 
                onClick={handlePrevious}
                aria-label="Image précédente"
              >
                &#10094;
              </button>
              
              <img 
                src={imagesList[activeIndex].url} 
                alt={imagesList[activeIndex].caption || `${title} - Image ${activeIndex + 1} (plein écran)`}
                className="fullscreen-image"
              />
              
              <button 
                className="fullscreen-nav next" 
                onClick={handleNext}
                aria-label="Image suivante"
              >
                &#10095;
              </button>
            </div>
            
            <div className="fullscreen-counter">
              {activeIndex + 1} / {imagesList.length}
            </div>
            
            {imagesList[activeIndex].caption && (
              <div className="fullscreen-caption">
                {imagesList[activeIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;