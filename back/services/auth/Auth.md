# Microservice d'Authentification pour Ziggla

Ce microservice fournit les fonctionnalités d'authentification essentielles pour vos projets Ziggla (client et admin).

## Installation

1. Créez un nouveau dossier pour votre microservice et copiez tous les fichiers fournis
2. Installez les dépendances:
   ```
   npm install
   ```
3. Configurez votre fichier `.env` avec vos propres valeurs (MongoDB URI, JWT Secret)
4. Assurez-vous que MongoDB est en cours d'exécution

## Démarrage

Pour démarrer le serveur en mode développement:
```
npm run dev
```

Pour démarrer le serveur en mode production:
```
npm start
```

## Seed des données (optionnel)

Pour ajouter des utilisateurs de test à la base de données:
```
node seedUsers.js
```

Cela créera:
- Un administrateur (admin@ziggla.com / password123)
- Un utilisateur standard (john@example.com / password123)

## Endpoints API

### Publics

- **POST /api/auth/register** - Inscription d'un nouvel utilisateur
  ```json
  {
    "name": "Nom Utilisateur",
    "email": "utilisateur@example.com",
    "password": "motdepasse"
  }
  ```

- **POST /api/auth/login** - Connexion d'un utilisateur
  ```json
  {
    "email": "utilisateur@example.com",
    "password": "motdepasse"
  }
  ```

### Protégés (nécessitant un token JWT)

- **GET /api/auth/profile** - Récupérer le profil de l'utilisateur connecté
- **GET /api/auth/validate** - Vérifier si le token est valide
- **GET /api/auth/admin** - Route de test pour vérifier les droits d'administration

## Intégration avec les applications React

1. Copiez le fichier `authService.ts` dans votre projet React
2. Utilisez les fonctions du service pour gérer l'authentification
3. Exemple d'utilisation dans un composant de connexion:

```tsx
import { useState } from 'react';
import authService from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login({ email, password });
      console.log('Connecté avec succès:', user);
      // Rediriger vers la page d'accueil ou le tableau de bord
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Connexion</h1>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Mot de passe</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginPage;
```

## Protection des routes dans React

Vous pouvez créer un composant ProtectedRoute pour sécuriser les routes qui nécessitent une authentification:

```tsx
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default ProtectedRoute;
```

Utilisation dans vos routes:

```tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

## Sécurité

Ce microservice implémente:
- Hachage des mots de passe avec bcrypt
- Authentification par token JWT
- Protection des routes sensibles
- Vérification des rôles utilisateur