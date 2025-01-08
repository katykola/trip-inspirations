import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useLocation } from '../context/LocationContext';
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types/types';

interface VisibleTripsContextProps {
  visibleTrips: Trip[];
  isLoading: boolean;
}

const VisibleTripsContext = createContext<VisibleTripsContextProps | undefined>(undefined);

export const VisibleTripsProvider = ({ children }: { children: ReactNode }) => {
  const { currentLocation, searchedLocation, mapRadius } = useLocation();
  const { data: trips, error } = useTrips();
  const [visibleTrips, setVisibleTrips] = useState(trips || []);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const tripsLocation = searchedLocation || currentLocation || [48.210033, 16.363449];

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Filter visible trips based on current location
  useEffect(() => {
    setIsLoading(true);
    if (tripsLocation && trips) {
      const filteredTrips = trips.filter((trip) => {
        const distance = calculateDistance(tripsLocation[0], tripsLocation[1], trip.lat, trip.lng);
        return distance <= mapRadius / 1000;
      });
      setVisibleTrips(filteredTrips);
    } else {
      setVisibleTrips([]);
    }
    setIsLoading(false);
  }, [tripsLocation, trips, mapRadius]);

  return (
    <VisibleTripsContext.Provider value={{ isLoading, visibleTrips }}>
      {children}
    </VisibleTripsContext.Provider>
  );
};

export const useVisibleTrips = () => {
  const context = useContext(VisibleTripsContext);
  if (!context) {
    throw new Error('useVisibleTrips must be used within a VisibleTripsProvider');
  }
  return context;
};