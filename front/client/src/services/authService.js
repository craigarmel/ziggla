import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth`;

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

const authService = {
  // Inscription
  register: async (userData) => {
    console.log('Données d\'inscription envoyées:', userData);
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Connexion
  login: async (credentials) => {
    console.log('Données de connexion envoyées:', credentials);
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  },

  // Récupérer le profil de l'utilisateur
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Vérifier la validité du token
  validateToken: async () => {
    try {
      const response = await api.get('/validate');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isLoggedIn: () => {
    return localStorage.getItem('userToken') !== null;
  },

  // Récupérer l'utilisateur stocké
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user !== null && user.isAdmin === true;
  }
};

export default authService;