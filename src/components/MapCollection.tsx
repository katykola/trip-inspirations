import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { Trip } from '../types/types';
import L from 'leaflet';
import { useTrips } from '../hooks/useTrips';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../utils/breakpoints';
import { headerHeight, menuBarHeight } from '../utils/styling';
import { useVisibleTrips } from '../context/VisibleTripsContext';

import redMarkerIcon from '../images/marker-icon.png'; // Update the path to your marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype.options.iconUrl;
delete L.Icon.Default.prototype.options.iconRetinaUrl;
delete L.Icon.Default.prototype.options.shadowUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const selectedMarkerIcon = L.icon({
  iconUrl: redMarkerIcon, 
  shadowUrl: markerShadow, 
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34], 
});

interface MapCollectionProps {
  collectionId: string;
}

const MapCollection: React.FC<MapCollectionProps> = ({ collectionId }) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const isMobile = useMediaQuery(smallScreenBreakpoint);
  const { selectedTripId } = useVisibleTrips();

  const mapRef = useRef<L.Map>(null);

  const { data: trips = [], isLoading, error } = useTrips(userId);

  const validTrips = trips.filter(trip => trip.collection === collectionId && trip.lat !== undefined && trip.lng !== undefined);

  useEffect(() => {
    if (validTrips.length > 0 && mapRef.current) {
       const bounds = L.latLngBounds(validTrips.map(trip => [trip.lat, trip.lng]));
       mapRef.current.fitBounds(bounds);
    }
 }, [validTrips]); // No need to reset mapKey here.
 

  const center: [number, number] = validTrips.length > 0 ? [validTrips[0].lat, validTrips[0].lng] : [48.210033, 16.363449];
  const zoom = 8;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading trips: {error.message}</div>;
  }

  console.log('selectedTripId', selectedTripId);  

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={false} // Disable the default zoom control
      style={{
        height: isMobile ? '100vh' : `calc(100vh - (${headerHeight} + ${menuBarHeight}))`,
        width: '100%',
      }}    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="topright" />
      <MarkerClusterGroup>
        {validTrips.map((trip: Trip) => (
          <Marker
            key={trip.id}
            position={[trip.lat, trip.lng] as L.LatLngExpression}
            icon={trip.id === selectedTripId ? selectedMarkerIcon : L.Icon.Default.prototype}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapCollection;