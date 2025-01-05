import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextProps {
  selectedLocation: [number, number] | null;
  setSelectedLocation: (location: [number, number]) => void;
  currentLocation: [number, number] | null;
  setCurrentLocation: (location: [number, number]) => void;
  mapRadius: number;
  setMapRadius: (radius: number) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [mapRadius, setMapRadius] = useState(30000);

  //Get current location
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

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, currentLocation, setCurrentLocation, mapRadius, setMapRadius }}>
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
