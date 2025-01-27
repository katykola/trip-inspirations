import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface LocationContextProps {
  selectedLocation: [number, number] | null;
  setSelectedLocation: (location: [number, number]) => void;
  currentLocation: [number, number] | null;
  setCurrentLocation: (location: [number, number]) => void;
  mapRadius: number;
  setMapRadius: (radius: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  searchedLocation: [number, number] | null;
  setSearchedLocation: (location: [number, number]) => void;
  page: number,
  setPage: (page: number) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<[number, number] | null>(null);
  const [mapRadius, setMapRadius] = useState(30000);
  const [zoom, setZoom] = useState(9);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  
  useEffect(() => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setCurrentLocation(null);
      setSelectedLocation(null);
      setSearchedLocation(null);
      setMapRadius(30000);
      setZoom(9);
    }
  }, [user]);



  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, currentLocation, setCurrentLocation, mapRadius, setMapRadius, zoom, setZoom, searchedLocation, setSearchedLocation, page, setPage }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
