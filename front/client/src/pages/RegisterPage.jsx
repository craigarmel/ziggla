import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <Link to="/" className="flex items-center justify-center mb-8">
            <span className="font-serif text-2xl font-bold text-ocean-blue-700">Ziggla</span>
            <span className="ml-1 text-gold-500 font-serif text-2xl">Luxury</span>
          </Link>
          
          <RegisterForm />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              En créant un compte, vous acceptez nos{' '}
              <Link to="/terms" className="text-ocean-blue-600 hover:text-ocean-blue-800">
                conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link to="/privacy" className="text-ocean-blue-600 hover:text-ocean-blue-800">
                politique de confidentialité
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;