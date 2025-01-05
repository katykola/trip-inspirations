import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Trip } from '../types/types';


interface MapScrollerProps {
    singleTripId: string | null;
    multipleTrips: Trip[];
  }
  
export default function MapScroller({ singleTripId, multipleTrips }: MapScrollerProps) {
  const map = useMap();
  
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
  
    return null;
  }
  
