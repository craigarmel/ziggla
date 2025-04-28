import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Création du contexte
export const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Valider le token
          const isValid = await authService.validateToken();
          if (isValid) {
            setUser(currentUser);
          } else {
            // Token invalide, déconnecter l'utilisateur
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        setError('Une erreur s\'est produite lors de la vérification de l\'authentification.');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};