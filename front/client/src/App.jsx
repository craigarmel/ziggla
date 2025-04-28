import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PropertyListPage from './pages/PropertyListPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes avec layout principal */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />

            {/* Propriétés */}
            <Route path="/properties" element={<PropertyListPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

            {/* Routes protégées */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="container-custom py-16">
                    <h1 className="text-3xl font-serif font-bold mb-6">Mon Profil</h1>
                    <p>Cette page est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <div className="container-custom py-16">
                    <h1 className="text-3xl font-serif font-bold mb-6">Mes Réservations</h1>
                    <p>Cette page est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <div className="container-custom py-16">
                    <h1 className="text-3xl font-serif font-bold mb-6">Tableau de bord Admin</h1>
                    <p>Cette page est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Pages statiques */}
            <Route
              path="/about"
              element={
                <div className="container-custom py-16">
                  <h1 className="text-3xl font-serif font-bold mb-6">À propos de Ziggla Luxury</h1>
                  <p>Cette page est en cours de développement.</p>
                </div>
              }
            />
            <Route
              path="/contact"
              element={
                <div className="container-custom py-16">
                  <h1 className="text-3xl font-serif font-bold mb-6">Contact</h1>
                  <p>Cette page est en cours de développement.</p>
                </div>
              }
            />

            {/* Page 404 */}
            <Route
              path="*"
              element={
                <div className="container-custom py-16 text-center">
                  <h1 className="text-4xl font-serif font-bold mb-6">404</h1>
                  <p className="text-xl mb-8">Oups! La page que vous recherchez n'existe pas.</p>
                  <a href="/" className="btn-primary inline-block">Retour à l'accueil</a>
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
