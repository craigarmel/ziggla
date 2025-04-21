import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import reviewService from '../../services/reviewService';

const StarRating = ({ rating, onChange, interactive = false }) => {
  const [hover, setHover] = useState(0);
  
  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };
  
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${starValue <= (hover || rating) ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            onMouseLeave={() => interactive && setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const ReviewItem = ({ review, onDelete }) => {
  const { user } = useAuthContext();
  const canDelete = user && (user.id === review.userId || user.role === 'admin');
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="reviewer-info">
          <h4 className="reviewer-name">{review.userName}</h4>
          <span className="review-date">{formatDate(review.createdAt)}</span>
        </div>
        <StarRating rating={review.rating} />
      </div>
      
      <div className="review-content">
        <p>{review.comment}</p>
      </div>
      
      {canDelete && (
        <button 
          className="delete-review" 
          onClick={() => onDelete(review._id)}
          aria-label="Supprimer cet avis"
        >
          Supprimer
        </button>
      )}
    </div>
  );
};

const ReviewForm = ({ propertyId, onReviewAdded }) => {
  const { isAuthenticated, user } = useAuthContext();
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    setError(null);
  };
  
  const handleCommentChange = (e) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }));
    setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour laisser un avis.');
      return;
    }
    
    if (formData.rating === 0) {
      setError('Veuillez attribuer une note à cette propriété.');
      return;
    }
    
    if (formData.comment.trim() === '') {
      setError('Veuillez rédiger un commentaire.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newReview = await reviewService.createReview(propertyId, {
        ...formData,
        userId: user.id,
        userName: user.name
      });
      
      // Réinitialiser le formulaire
      setFormData({
        rating: 0,
        comment: ''
      });
      
      // Notifier le parent
      if (onReviewAdded) {
        onReviewAdded(newReview);
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'avis. Veuillez réessayer.');
      console.error('Erreur lors de la création de l\'avis:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="review-login-prompt">
        <p>Vous devez être <a href="/login">connecté</a> pour laisser un avis.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Donnez votre avis</h4>
      
      <div className="form-group">
        <label>Votre note:</label>
        <StarRating 
          rating={formData.rating} 
          onChange={handleRatingChange} 
          interactive={true} 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="review-comment">Votre commentaire:</label>
        <textarea
          id="review-comment"
          value={formData.comment}
          onChange={handleCommentChange}
          placeholder="Partagez votre expérience avec cette propriété..."
          rows="4"
          required
        ></textarea>
      </div>
      
      {error && (
        <div className="review-error">{error}</div>
      )}
      
      <button 
        type="submit" 
        className="submit-review" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Envoi en cours...' : 'Soumettre mon avis'}
      </button>
    </form>
  );
};

const PropertyReviews = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  
  const fetchReviews = async () => {
    setLoading(true);
    
    try {
      const data = await reviewService.getReviewsByPropertyId(propertyId);
      setReviews(data);
      
      // Calculer la note moyenne
      if (data.length > 0) {
        const total = data.reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(total / data.length);
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      setError('Erreur lors du chargement des avis.');
      console.error('Erreur lors du chargement des avis:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId]);
  
  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    
    // Recalculer la note moyenne
    const total = reviews.reduce((acc, review) => acc + review.rating, 0) + newReview.rating;
    setAverageRating(total / (reviews.length + 1));
  };
  
  const handleReviewDeleted = async (reviewId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      try {
        await reviewService.deleteReview(reviewId);
        
        // Mettre à jour la liste des avis
        const updatedReviews = reviews.filter(review => review._id !== reviewId);
        setReviews(updatedReviews);
        
        // Recalculer la note moyenne
        if (updatedReviews.length > 0) {
          const total = updatedReviews.reduce((acc, review) => acc + review.rating, 0);
          setAverageRating(total / updatedReviews.length);
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        setError('Erreur lors de la suppression de l\'avis.');
        console.error('Erreur lors de la suppression de l\'avis:', err);
      }
    }
  };
  
  if (loading && reviews.length === 0) {
    return <div className="reviews-loading">Chargement des avis...</div>;
  }
  
  return (
    <div className="property-reviews">
      <div className="reviews-header">
        <h3>Avis des clients</h3>
        
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-value">{averageRating.toFixed(1)}</span>
            <StarRating rating={averageRating} />
            <span className="reviews-count">({reviews.length} avis)</span>
          </div>
        </div>
      </div>
      
      <ReviewForm 
        propertyId={propertyId} 
        onReviewAdded={handleReviewAdded} 
      />
      
      {error && (
        <div className="reviews-error">{error}</div>
      )}
      
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
          </div>
        ) : (
          reviews.map(review => (
            <ReviewItem 
              key={review._id} 
              review={review} 
              onDelete={handleReviewDeleted} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyReviews;