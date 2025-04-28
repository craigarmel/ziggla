import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour que le prochain rendu affiche l'UI de secours
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez aussi enregistrer l'erreur dans un service de rapport d'erreurs
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Ici, vous pourriez envoyer l'erreur à un service comme Sentry
    // if (typeof window.Sentry !== 'undefined') {
    //   window.Sentry.captureException(error);
    // }
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // Vous pouvez rendre n'importe quelle UI de secours personnalisée
      if (fallback) {
        return fallback(error, errorInfo, () => this.setState({ hasError: false, error: null, errorInfo: null }));
      }

      return (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-800 mb-2">Une erreur est survenue</h2>
          <p className="text-red-700 mb-4">
            Quelque chose s'est mal passé lors de l'affichage de ce composant.
          </p>
          {error && (
            <details className="mt-2 text-sm text-red-700 bg-red-100 p-2 rounded">
              <summary className="cursor-pointer font-medium">Détails de l'erreur</summary>
              <p className="mt-2">{error.toString()}</p>
              {errorInfo && (
                <pre className="mt-2 overflow-auto p-2 bg-red-50 border border-red-200 rounded">
                  {errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;