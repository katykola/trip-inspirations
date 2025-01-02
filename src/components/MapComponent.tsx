import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../hooks/useTrip';
import '../styles/MapWithCoordinates.css';
import { greenMarkerIcon, markerIcon } from '../utils/mapMarkers';
import MapScroller from './MapScroller';
import { useLocation } from '../context/LocationContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';

export default function MapComponent() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: singleTrip, isLoading: singleTripLoading } = useTrip(id || ''); // single trip based on params id
  const { selectedLocation, currentLocation, mapRadius } = useLocation();
  const { visibleTrips, isLoading: visibleTripsLoading } = useVisibleTrips();
  
  if (singleTripLoading || visibleTripsLoading) {
    return <div>Loading...</div>;
  }
  
  const handleClick = (id: string) => {
    navigate(`/trip/${id}`); // Navigate to trip detail page
  };

  const center = selectedLocation || currentLocation || [48.210033, 16.363449];
  const zoom = selectedLocation ? 14 : 10;

  if (!center) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: 'calc(100vh - 4rem)', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {visibleTrips &&
          visibleTrips.map((trip) => (
            <Marker
              key={trip.id}
              position={[trip.lat, trip.lng]}
              eventHandlers={{
                click: () => {
                  handleClick(trip.id);
                },
              }}
            >
            </Marker>
          ))}
      </MarkerClusterGroup>
      {center && (
        <Circle
          center={center}
          radius={mapRadius}
          color="black"
          fillColor="black"
          fillOpacity={0.05} // More transparent fill
          opacity={0.2} // More transparent border          
          weight={1} // Thinner border
        />
      )}
      <MapScroller singleTripId={singleTrip ? singleTrip.id : ''} multipleTrips={visibleTrips || []} />
    </MapContainer>
  );
}
