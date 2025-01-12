import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Trip } from '../types/types';
import { useLocation } from '../context/LocationContext';
import { useTrips } from '../hooks/useTrips';

interface MapScrollerProps {
    singleTripId: string | null;
    multipleTrips: Trip[];
  }

export default function MapScroller({ singleTripId }: MapScrollerProps) {
  const map = useMap();
  const trips = useTrips();
  const { setZoom, setSelectedLocation } = useLocation();
  
  useEffect(() => {
    if (singleTripId && trips) {
      const selectedTrip = trips.data?.find((trip) => trip.id === singleTripId);
      if (selectedTrip && selectedTrip.lat !== undefined && selectedTrip.lng !== undefined) {
        map.flyTo([selectedTrip.lat, selectedTrip.lng], 14);
      } else {
        console.error('Selected trip not found:', singleTripId);
      }
    } 
    }, [singleTripId, map]);


    useEffect(() => {
      const handleMoveEnd = () => {
        setZoom(map.getZoom());
        setSelectedLocation([map.getCenter().lat, map.getCenter().lng]);
      };
      
      map.on('moveend', handleMoveEnd);
      
      return () => {
        map.off('moveend', handleMoveEnd);
      };
    }, [map]);


    return null;
    
  }

  
