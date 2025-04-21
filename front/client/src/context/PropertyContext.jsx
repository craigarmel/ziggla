import React, { createContext, useState, useContext, useEffect } from 'react';
import propertyService from '../services/propertyService';

// Création du contexte
const PropertyContext = createContext();

// Fournisseur du contexte pour les propriétés
export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les propriétés au démarrage
  useEffect(() => {
    loadProperties();
  }, []);
  
  // Fonction pour charger ou rafraîchir les propriétés
  const loadProperties = async (filters = {}, forceRefresh = false) => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties(filters, forceRefresh);
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des propriétés');
    } finally {
      setLoading(false);
    }
  };
  
  // Valeur exposée par le contexte
  const contextValue = {
    properties, 
    loading, 
    error, 
    refreshProperties: loadProperties,
    
    // Fonctions utilitaires
    getPropertyById: (id) => properties.find(p => p._id === id),
    
    filterByPrice: (minPrice, maxPrice) => {
      const filtered = propertyService.filterPropertiesByPrice(minPrice, maxPrice);
      setProperties(filtered);
    },
    
    filterByType: (propertyType) => {
      const filtered = propertyService.filterPropertiesByType(propertyType);
      setProperties(filtered);
    },
    
    sortByPrice: (ascending = true) => {
      const sorted = propertyService.sortPropertiesByPrice(ascending);
      setProperties([...sorted]);
    },
    
    // Fonctions CRUD
    createProperty: async (propertyData) => {
      try {
        setLoading(true);
        const newProperty = await propertyService.createProperty(propertyData);
        await loadProperties({}, true);
        return newProperty;
      } catch (err) {
        setError('Erreur lors de la création de la propriété');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    
    updateProperty: async (id, propertyData) => {
      try {
        setLoading(true);
        const updatedProperty = await propertyService.updateProperty(id, propertyData);
        await loadProperties({}, true);
        return updatedProperty;
      } catch (err) {
        setError(`Erreur lors de la mise à jour de la propriété ${id}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    
    deleteProperty: async (id) => {
      try {
        setLoading(true);
        await propertyService.deleteProperty(id);
        await loadProperties({}, true);
      } catch (err) {
        setError(`Erreur lors de la suppression de la propriété ${id}`);
        throw err;
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte des propriétés
export const usePropertyContext = () => useContext(PropertyContext);