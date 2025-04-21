import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reviews`;

// Création d'une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Données mock pour les avis
const mockReviews = [
  {
    _id: "5f8e747ab54764421b709e3d",
    bookingId: "5f8e7445b54764421b709e3c",
    propertyId: "5f8e73f1b54764421b709e3a",
    userId: {
      _id: "5f8e7412b54764421b709e3b",
      firstName: "Jean",
      lastName: "Dupont"
    },
    rating: 4.8,
    comment: "Séjour fantastique! L'appartement est magnifique et le jacuzzi est un vrai plus. La vue sur Londres est à couper le souffle. Seul petit bémol, le bruit de la rue le matin mais rien de grave.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80",
        caption: "Vue depuis le salon"
      }
    ],
    ownerResponse: {
      content: "Merci beaucoup pour votre avis Jean! Nous sommes ravis que vous ayez apprécié votre séjour. Concernant le bruit, nous envisageons d'installer un double vitrage supplémentaire. Au plaisir de vous accueillir à nouveau!",
      timestamp: "2023-07-02T16:45:00.000Z"
    },
    createdAt: "2023-06-24T14:30:00.000Z",
    isApproved: true,
    helpfulVotes: 5
  },
  {
    _id: "5f8e747bb54764421b709e3e",
    bookingId: "5f8e7446b54764421b709e3d",
    propertyId: "5f8e73f2b54764421b709e4a",
    userId: {
      _id: "5f8e7412b54764421b709e3b",
      firstName: "Jean",
      lastName: "Dupont"
    },
    rating: 4.5,
    comment: "Le studio est très bien situé et parfaitement équipé. Le jacuzzi était un vrai plaisir après une journée de visite. Petit bémol sur la pression de l'eau qui est un peu faible.",
    photos: [],
    ownerResponse: null,
    createdAt: "2023-08-19T18:30:00.000Z",
    isApproved: true,
    helpfulVotes: 2
  },
  {
    _id: "5f8e747cc54764421b709e3f",
    bookingId: "5f8e7447b54764421b709e3e",
    propertyId: "5f8e73f1b54764421b709e3a",
    userId: {
      _id: "5f8e7413b54764421b709e3c",
      firstName: "Marie",
      lastName: "Martin"
    },
    rating: 4.9,
    comment: "Un appartement exceptionnel avec une vue imprenable. Tout était parfait, de l'accueil au départ. Le jacuzzi est vraiment agréable en fin de journée. Je recommande vivement !",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        caption: "Vue de nuit"
      },
      {
        url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
        caption: "Le jacuzzi"
      }
    ],
    ownerResponse: {
      content: "Merci beaucoup pour votre avis Marie ! Nous sommes ravis que vous ayez passé un excellent séjour. Au plaisir de vous accueillir à nouveau !",
      timestamp: "2023-05-15T10:30:00.000Z"
    },
    createdAt: "2023-05-12T14:30:00.000Z",
    isApproved: true,
    helpfulVotes: 8
  }
];

// Service pour gérer les avis
const reviewService = {
  // Récupérer tous les avis d'une propriété
  getReviewsByProperty: async (propertyId) => {
    try {
      // En production
      // const response = await api.get(`/property/${propertyId}`);
      // return response.data;
      
      // Pour le moment, utilisons les données mock
      return mockReviews.filter(review => review.propertyId === propertyId);
    } catch (error) {
      console.error(`Erreur lors de la récupération des avis pour la propriété ${propertyId}:`, error);
      throw error;
    }
  },
  
  // Récupérer les avis d'un utilisateur
  getReviewsByUser: async (userId) => {
    try {
      // En production
      // const response = await api.get(`/user/${userId}`);
      // return response.data;
      
      // Pour le moment, utilisons les données mock
      return mockReviews.filter(review => review.userId._id === userId);
    } catch (error) {
      console.error(`Erreur lors de la récupération des avis de l'utilisateur ${userId}:`, error);
      throw error;
    }
  },
  
  // Ajouter un avis
  addReview: async (reviewData) => {
    try {
      // En production
      // const response = await api.post('/', reviewData);
      // return response.data;
      
      // Pour le moment, simulons l'ajout d'un avis
      const newReview = {
        _id: `mock-review-${Date.now()}`,
        ...reviewData,
        createdAt: new Date().toISOString(),
        isApproved: false,
        helpfulVotes: 0
      };
      
      // Dans un vrai backend, l'avis serait sauvegardé dans la base de données
      console.log('Nouvel avis ajouté:', newReview);
      
      return newReview;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un avis:', error);
      throw error;
    }
  },
  
  // Marquer un avis comme utile
  markReviewAsHelpful: async (reviewId) => {
    try {
      // En production
      // const response = await api.post(`/${reviewId}/helpful`);
      // return response.data;
      
      // Pour le moment, simulons le marquage d'un avis comme utile
      const review = mockReviews.find(r => r._id === reviewId);
      if (!review) {
        throw new Error('Avis non trouvé');
      }
      
      // Dans un vrai backend, le nombre de votes serait incrémenté dans la base de données
      review.helpfulVotes += 1;
      
      return { success: true };
    } catch (error) {
      console.error(`Erreur lors du marquage de l'avis ${reviewId} comme utile:`, error);
      throw error;
    }
  },
  
  // Répondre à un avis (pour les propriétaires)
  respondToReview: async (reviewId, responseContent) => {
    try {
      // En production
      // const response = await api.post(`/${reviewId}/respond`, { content: responseContent });
      // return response.data;
      
      // Pour le moment, simulons la réponse à un avis
      const review = mockReviews.find(r => r._id === reviewId);
      if (!review) {
        throw new Error('Avis non trouvé');
      }
      
      // Dans un vrai backend, la réponse serait sauvegardée dans la base de données
      review.ownerResponse = {
        content: responseContent,
        timestamp: new Date().toISOString()
      };
      
      return review;
    } catch (error) {
      console.error(`Erreur lors de la réponse à l'avis ${reviewId}:`, error);
      throw error;
    }
  }
};

export default reviewService;