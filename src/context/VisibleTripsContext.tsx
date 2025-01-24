import { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useLocation } from '../context/LocationContext';
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types/types';

interface VisibleTripsContextProps {
  visibleTrips: Trip[];
  setVisibleTrips: (trips: Trip[]) => void;
  isLoading: boolean;
  selectedTripId: string | null;
  setSelectedTripId: (id: string | null) => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  showAreaButton: boolean;
  setShowAreaButton: (showAreaButton: boolean) => void;
  areaSearched: boolean;
  setAreaSearched: (areaSearched: boolean) => void;
}

const VisibleTripsContext = createContext<VisibleTripsContextProps | undefined>(undefined);

export const VisibleTripsProvider = ({ children }: { children: ReactNode }) => {
  const { currentLocation, searchedLocation, mapRadius } = useLocation();
  const { data: trips, isLoading: tripsLoading } = useTrips();
  const user = useAuth();
  const isLoggedIn = !!user?.user;
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [showAreaButton, setShowAreaButton] = useState(false);
  const [areaSearched, setAreaSearched] = useState(false);
  

  // Determine the base location
  const tripsLocation = useMemo(
    () => searchedLocation || currentLocation || [48.210033, 16.363449],
    [searchedLocation, currentLocation]
  );

  // Haversine formula for distance calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Filter trips based on location and filter criteria
  const visibleTrips = useMemo(() => {
    if (!trips || !tripsLocation) return [];

    const locationFiltered = trips.filter((trip) => {
      const distance = calculateDistance(tripsLocation[0], tripsLocation[1], trip.lat, trip.lng);
      return distance <= mapRadius / 1000; // Convert radius to km
    });

    return locationFiltered;
  }, [tripsLocation, mapRadius, isLoggedIn]);

  const isLoading = tripsLoading;

  return (
    <VisibleTripsContext.Provider value={{ visibleTrips, setVisibleTrips: () => {}, isLoading, selectedTripId, setSelectedTripId, panelOpen, setPanelOpen, showAreaButton, setShowAreaButton, areaSearched, setAreaSearched }}>
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
