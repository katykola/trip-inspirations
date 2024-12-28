import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from '../images/marker-icon.png';
import greenMarkerIconUrl from '../images/greenMarkerIconUrl.png'; // Add a green marker icon
import { Typography } from '@mui/material';
import { Trip } from '../types/types';
import { useTrip } from '../hooks/useTrip';
import { useTrips } from '../hooks/useTrips';

interface MapComponentProps {
  tripId?: string;
  selectedTripId?: string | null;
  trips?: Trip[];
  onTripSelect?: (id: string) => void;
}

function MapComponent({ tripId, trips, onTripSelect, selectedTripId = null }: MapComponentProps) {

  const [fetchedTrips, setFetchedTrips] = useState<Trip[]>([]);

  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

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

  console.log('Current Location:', currentLocation);
  
  const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const greenMarkerIcon = new L.Icon({
    iconUrl: greenMarkerIconUrl,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const { data: singleTrip, isLoading: singleTripLoading } = useTrip(tripId || '');
  const { data: multipleTrips, isLoading: multipleTripsLoading } = useTrips();

  useEffect(() => {
    if (tripId && singleTrip) {
      console.log('Single Trip:', singleTrip);
      setFetchedTrips([singleTrip]);
    } else if (trips) {
      console.log('Multiple Trips:', trips);
      setFetchedTrips(trips);
    } else if (multipleTrips) {
      console.log('Multiple Trips:', multipleTrips);
      setFetchedTrips(multipleTrips);
    }
  }, [tripId, singleTrip, trips, multipleTrips]);

  const handleClick = (id: string) => {
    if (onTripSelect) {
      onTripSelect(id);
      console.log('Selected Trip ID:', id);
    }
  };

  if (singleTripLoading || multipleTripsLoading) {
    return <div>Loading...</div>;
  }

  const center: [number, number] = currentLocation ? currentLocation : selectedTripId && singleTrip ? [singleTrip?.lat, singleTrip?.lng] : [49.195061, 16.606836];

  return (
    <MapContainer center={center} zoom={13} style={{ height: 'calc(100vh - 4rem)', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {fetchedTrips.map((trip) => (
        <Marker
          key={trip.id}
          position={[trip.lat, trip.lng]}
          icon={trip.id === selectedTripId ? greenMarkerIcon : markerIcon}
          eventHandlers={{ click: () => handleClick(trip.id) }}
        >
          <Popup>
            <Typography variant="body2">{trip.title}</Typography>
          </Popup>
        </Marker>
      ))}z
      <MapScroller selectedTripId={selectedTripId} fetchedTrips={fetchedTrips} />
    </MapContainer>
  );
}

interface MapScrollerProps {
  selectedTripId: string | null;
  fetchedTrips: Trip[];
}

function MapScroller({ selectedTripId, fetchedTrips }: MapScrollerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedTripId) {
      const selectedTrip = fetchedTrips.find(trip => trip.id === selectedTripId);
      if (selectedTrip) {
        map.flyTo([selectedTrip.lat, selectedTrip.lng], 15);
      }
    }
  }, [selectedTripId, fetchedTrips, map]);

  return null;
}

export default MapComponent;