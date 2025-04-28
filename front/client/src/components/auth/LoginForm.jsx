import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirection après connexion
  const from = location.state?.from?.pathname || '/';

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiError('');
      console.log('Tentative de connexion avec:', data.email);
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setApiError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h2 className="text-2xl font-serif font-bold text-center text-gray-800 mb-6">
        Connexion à votre compte
      </h2>

      {apiError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 text-sm">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="votre@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          })}
        />

        <Input
          label="Mot de passe"
          id="password"
          type="password"
          placeholder="Votre mot de passe"
          error={errors.password?.message}
          {...register('password', {
            required: 'Le mot de passe est requis',
            minLength: {
              value: 6,
              message: 'Le mot de passe doit contenir au moins 6 caractères'
            }
          })}
        />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-ocean-blue-600 focus:ring-ocean-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="text-ocean-blue-600 hover:text-ocean-blue-800">
              Mot de passe oublié?
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Vous n'avez pas de compte?{' '}
          <Link to="/register" className="text-ocean-blue-600 hover:text-ocean-blue-800 font-medium">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;