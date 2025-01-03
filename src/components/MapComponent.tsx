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
import { headerHeight, menuBarHeight } from '../config/styling';

export default function MapComponent() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: singleTrip, isLoading: singleTripLoading } = useTrip(id || ''); // single trip based on params id
  const { selectedLocation, currentLocation, mapRadius } = useLocation();
  const { visibleTrips, isLoading: visibleTripsLoading } = useVisibleTrips();

  
  if (singleTripLoading || visibleTripsLoading) {
    return <div>Loading...</div>;
  }
  

  const center = selectedLocation || currentLocation || [48.210033, 16.363449];
  const zoom = selectedLocation ? 14 : mapRadius === 5000 ? 12 : mapRadius === 10000 ? 11 : mapRadius === 30000 ? 10 : mapRadius === 50000 ? 9 : mapRadius === 100000 ? 8 : mapRadius === 300000 ? 6 : 5;
    
  if (!center) {
      return <div>Loading map...</div>;
    }
    
    const handleClick = (id: string) => {
      navigate(`/trip/${id}`); // Navigate to trip detail page
    };

    console.log('Visible Trips:', visibleTrips);

  
  return (
    <MapContainer 
      key={`${center}-${mapRadius}`} //ensure that markers are cleared and re-rendered correctly to avoid duplication
      center={center} 
      zoom={zoom} 
      style={{ height: `calc(100vh - (${headerHeight} + ${menuBarHeight}))`, width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    <MarkerClusterGroup key={`cluster-${mapRadius}-${visibleTrips.length}`}>
      {visibleTrips.map((trip) => (
        <Marker
          key={trip.id}
          position={[trip.lat, trip.lng]}
          eventHandlers={{
            click: () => handleClick(trip.id),
          }}
        />
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
