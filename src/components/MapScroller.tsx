import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Trip } from '../types/types';
import { useLocation } from '../context/LocationContext';

interface MapScrollerProps {
    singleTripId: string | null;
    multipleTrips: Trip[];
  }

export default function MapScroller({ singleTripId, multipleTrips }: MapScrollerProps) {
  const map = useMap();
  const { zoom, setZoom, mapRadius, setSelectedLocation } = useLocation();
  
    useEffect(() => {
      if (singleTripId) {
        const selectedTrip = multipleTrips.find((trip) => trip.id === singleTripId);
        if (selectedTrip && selectedTrip.lat !== undefined && selectedTrip.lng !== undefined) {
          map.flyTo([selectedTrip.lat, selectedTrip.lng], 14);
        } else {
          console.error('Selected trip not found:', singleTripId);
        }
      } 
    }, [singleTripId, multipleTrips, map]);
    
    
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
  
    console.log('MapRadius:', mapRadius);
    console.log('Zoom:', zoom);
    
    return null;
    
  }

  
