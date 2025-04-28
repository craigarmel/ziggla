import React, { useState } from 'react';

const PropertyGallery = ({ images = [], title = 'Propriété' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const hasImages = images && images.length > 0;
  const imagesList = hasImages
    ? images
    : [{ url: '/placeholder-property.jpg', caption: 'Image non disponible' }];

  const handlePrevious = (e) => {
    e?.stopPropagation?.();
    setActiveIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation?.();
    setActiveIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  const toggleFullscreen = () => {
    setShowFullscreen((prev) => !prev);
  };

  React.useEffect(() => {
    if (!showFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setShowFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [showFullscreen, imagesList.length]);

  return (
    <div className="property-gallery w-full max-w-3xl mx-auto">
      <div className="main-image-container flex items-center justify-center gap-2 relative">
        <button
          className="gallery-nav prev absolute left-2 z-10 bg-white/70 hover:bg-blue-100 text-slate-700 rounded-full p-2 shadow-md transition disabled:opacity-40"
          onClick={handlePrevious}
          aria-label="Image précédente"
          disabled={imagesList.length < 2}
        >
          &#10094;
        </button>

        <div className="main-image-wrapper flex-1 flex justify-center items-center relative">
          <img
            src={imagesList[activeIndex].url}
            alt={imagesList[activeIndex].caption || `${title} - Image ${activeIndex + 1}`}
            className="main-image rounded-xl shadow-lg object-contain max-h-80 w-full cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={toggleFullscreen}
            loading="lazy"
          />

          <button
            className="fullscreen-toggle absolute bottom-3 right-3 bg-white/80 hover:bg-blue-100 text-slate-700 rounded-full p-2 shadow-md transition"
            onClick={toggleFullscreen}
            aria-label="Basculer en plein écran"
            title="Plein écran"
          >
            {showFullscreen ? '⤓' : '⤢'}
          </button>
        </div>

        <button
          className="gallery-nav next absolute right-2 z-10 bg-white/70 hover:bg-blue-100 text-slate-700 rounded-full p-2 shadow-md transition disabled:opacity-40"
          onClick={handleNext}
          aria-label="Image suivante"
          disabled={imagesList.length < 2}
        >
          &#10095;
        </button>
      </div>

      {imagesList.length > 1 && (
        <div className="thumbnails-container flex gap-3 mt-5 justify-center">
          {imagesList.map((image, index) => (
            <button
              key={index}
              className={`thumbnail rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                index === activeIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-transparent hover:border-blue-300'
              } focus:outline-none`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Voir l'image ${index + 1}`}
              tabIndex={0}
              style={{ padding: 0, background: 'none' }}
            >
              <img
                src={image.url}
                alt={image.caption || `${title} - Miniature ${index + 1}`}
                className="w-16 h-16 object-cover transition-transform duration-150 hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {imagesList[activeIndex].caption && (
        <div className="image-caption text-center text-zinc-500 mt-3 text-sm">{imagesList[activeIndex].caption}</div>
      )}

      {showFullscreen && (
        <div className="fullscreen-gallery fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={toggleFullscreen} tabIndex={-1}>
          <div className="fullscreen-content relative bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="fullscreen-close absolute top-3 right-3 text-3xl text-zinc-500 hover:text-red-500 transition"
              onClick={toggleFullscreen}
              aria-label="Fermer le plein écran"
              title="Fermer"
            >
              &times;
            </button>

            <div className="fullscreen-navigation flex items-center justify-center gap-6 mt-6">
              <button
                className="fullscreen-nav prev bg-white/80 hover:bg-blue-100 text-slate-700 rounded-full p-3 shadow-md transition disabled:opacity-40"
                onClick={handlePrevious}
                aria-label="Image précédente"
                disabled={imagesList.length < 2}
              >
                &#10094;
              </button>

              <img
                src={imagesList[activeIndex].url}
                alt={
                  imagesList[activeIndex].caption ||
                  `${title} - Image ${activeIndex + 1} (plein écran)`
                }
                className="fullscreen-image max-h-[70vh] rounded-xl object-contain shadow-lg"
                loading="lazy"
              />

              <button
                className="fullscreen-nav next bg-white/80 hover:bg-blue-100 text-slate-700 rounded-full p-3 shadow-md transition disabled:opacity-40"
                onClick={handleNext}
                aria-label="Image suivante"
                disabled={imagesList.length < 2}
              >
                &#10095;
              </button>
            </div>

            <div className="fullscreen-counter text-center text-zinc-400 mt-3">
              {activeIndex + 1} / {imagesList.length}
            </div>

            {imagesList[activeIndex].caption && (
              <div className="fullscreen-caption text-center text-zinc-700 mt-2 text-base">{imagesList[activeIndex].caption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;