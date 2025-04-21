import { useState, useCallback, useEffect } from 'react';
import propertyService from '../services/propertyService';

const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState({
    available: false,
    unavailableDates: []
  });

  // Charger toutes les propriétés
  const loadProperties = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAllProperties(filters);
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Une erreur s\'est produite lors du chargement des propriétés');
      console.error('Erreur loadProperties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger une propriété par son ID
  const loadProperty = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
    } catch (err) {
      setError(err.message || `Une erreur s'est produite lors du chargement de la propriété ${id}`);
      console.error(`Erreur loadProperty ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les aménagements
  const loadAmenities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAllAmenities();
      setAmenities(data);
    } catch (err) {
      setError(err.message || 'Une erreur s\'est produite lors du chargement des aménagements');
      console.error('Erreur loadAmenities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les points d'intérêt
  const loadPointsOfInterest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAllPointsOfInterest();
      setPointsOfInterest(data);
    } catch (err) {
      setError(err.message || 'Une erreur s\'est produite lors du chargement des points d\'intérêt');
      console.error('Erreur loadPointsOfInterest:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier la disponibilité d'une propriété
  const checkAvailability = useCallback(async (propertyId, startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.checkAvailability(propertyId, startDate, endDate);
      setAvailability(data);
      return data;
    } catch (err) {
      setError(err.message || 'Une erreur s\'est produite lors de la vérification de disponibilité');
      console.error('Erreur checkAvailability:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Rechercher des propriétés
  const searchProperties = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.searchProperties(searchParams);
      setProperties(data);
      return data;
    } catch (err) {
      setError(err.message || 'Une erreur s\'est produite lors de la recherche');
      console.error('Erreur searchProperties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    properties,
    property,
    amenities,
    pointsOfInterest,
    availability,
    loading,
    error,
    loadProperties,
    loadProperty,
    loadAmenities,
    loadPointsOfInterest,
    checkAvailability,
    searchProperties
  };
};

export default useProperties;