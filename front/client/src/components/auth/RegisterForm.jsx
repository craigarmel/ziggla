import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiError('');
      
      // On supprime confirmPassword avant d'envoyer au serveur
      const { confirmPassword, ...userData } = data;
      
      // Transforme le password pour correspondre au backend
      const formattedData = {
        ...userData,
        password: userData.password // Le backend renommera en passwordHash
      };

      console.log('Données d\'inscription formatées:', formattedData);
      
      await registerUser(formattedData);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setApiError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h2 className="text-2xl font-serif font-bold text-center text-gray-800 mb-6">
        Créer un compte
      </h2>

      {apiError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 text-sm">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Prénom"
          id="firstName"
          type="text"
          placeholder="Jean"
          error={errors.firstName?.message}
          {...register('firstName', {
            required: 'Le prénom est requis',
            minLength: {
              value: 2,
              message: 'Le prénom doit contenir au moins 2 caractères'
            }
          })}
        />

        <Input
          label="Nom"
          id="lastName"
          type="text"
          placeholder="Dupont"
          error={errors.lastName?.message}
          {...register('lastName', {
            required: 'Le nom est requis',
            minLength: {
              value: 2,
              message: 'Le nom doit contenir au moins 2 caractères'
            }
          })}
        />

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

        <Input
          label="Confirmer le mot de passe"
          id="confirmPassword"
          type="password"
          placeholder="Confirmez votre mot de passe"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Veuillez confirmer votre mot de passe',
            validate: value => 
              value === password || 'Les mots de passe ne correspondent pas'
          })}
        />

        <div className="mb-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-ocean-blue-600 focus:ring-ocean-blue-500 border-gray-300 rounded"
                {...register('terms', {
                  required: 'Vous devez accepter les conditions d\'utilisation'
                })}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                J'accepte les{' '}
                <Link to="/terms" className="text-ocean-blue-600 hover:text-ocean-blue-800">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="text-ocean-blue-600 hover:text-ocean-blue-800">
                  politique de confidentialité
                </Link>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte?{' '}
          <Link to="/login" className="text-ocean-blue-600 hover:text-ocean-blue-800 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;