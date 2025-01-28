import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useLocation } from '../context/LocationContext';
import { useTrips } from '../hooks/useTrips';
import { useAuth } from '../context/AuthContext';

interface MapScrollerProps {
    singleTripId: string | null;
    setShowAreaButton: (showAreaButton: boolean) => void;
  }

export default function MapScroller({ singleTripId, setShowAreaButton }: MapScrollerProps) {
  const map = useMap();
  const { setZoom, setSelectedLocation } = useLocation();
  const { user } = useAuth();
  const userId = user?.uid;
  const { data: trips, isLoading } = useTrips(userId);  

    useEffect(() => {
      if (!isLoading && singleTripId && trips) {
        const selectedTrip = trips.find((trip) => trip.id === singleTripId);
        if (selectedTrip) {
          const { lat, lng } = selectedTrip;
          if (lat !== undefined && lng !== undefined) {
            setShowAreaButton(false);
            map.flyTo([lat, lng], 14);
          } else {
            console.error('Selected trip does not have lat/lng:', selectedTrip);
          }
        } 
      }
    }, [singleTripId, isLoading, trips, map, setShowAreaButton]);

    useEffect(() => {
      const handleMoveEnd = () => {
        setZoom(map.getZoom());
        setSelectedLocation([map.getCenter().lat, map.getCenter().lng]);
      };
        
      map.on('moveend', handleMoveEnd);
        
        return () => {
          map.off('moveend', handleMoveEnd);
        };
      }, [map, setZoom, setSelectedLocation]);

    return null;
  }

  
