import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../hooks/useTrip';
import '../styles/MapWithCoordinates.css';
import MapScroller from './MapScroller';
import { useLocation } from '../context/LocationContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { headerHeight, menuBarHeight } from '../config/styling';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

// Fix for default icon paths
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

export default function MapComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: singleTrip, isLoading: singleTripLoading } = useTrip(id || '');
  const { selectedLocation, setSelectedLocation, currentLocation, mapRadius } = useLocation();
  const { visibleTrips, isLoading: visibleTripsLoading } = useVisibleTrips();
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const zoom = useMemo(() => {
    return selectedLocation
      ? 14
      : mapRadius === 5000
      ? 12
      : mapRadius === 10000
      ? 11
      : mapRadius === 30000
      ? 10
      : mapRadius === 50000
      ? 9
      : mapRadius === 100000
      ? 8
      : mapRadius === 300000
      ? 6
      : 5;
  }, [mapRadius, selectedLocation]);

  const center = mapCenter || selectedLocation || currentLocation || [48.210033, 16.363449];
  const circleCenter = currentLocation || [48.210033, 16.363449];

  if (singleTripLoading || visibleTripsLoading) {
    return <div>Loading...</div>;
  }

  const handleClick = (id: string) => {
    navigate(`/trip/${id}`); // Navigate to trip detail page
  };

  // Custom icon for the center marker
  const customIcon = L.divIcon({
    className: 'custom-center-icon',
    html: '<div style="font-size: 20px; color: #333333">x</div>',
  });

  const MapEvents = () => {
    const map = useMap(); // Access the map instance
  
    useEffect(() => {
      if (map) {
        // Only update the zoom level if a new zoom value is calculated
        map.setZoom(zoom);
      }
    }, [zoom, map]); // Dependencies ensure this runs when the zoom level changes
  
    useMapEvents({
      moveend: (event) => {
        const mapCenter = event.target.getCenter();
        setMapCenter([mapCenter.lat, mapCenter.lng]); // Update the map center without affecting zoom
      },
    });
  
    return null;
  };
  

  console.log('selectedLocation:', selectedLocation);
  console.log('mapRadius:', mapRadius);
  console.log('zoom:', zoom);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: `calc(100vh - (${headerHeight} + ${menuBarHeight}))`, width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
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
        <>
          <Circle
            center={circleCenter}
            radius={mapRadius}
            color="black"
            fillColor="black"
            fillOpacity={0.05} // More transparent fill
            opacity={0.4} // More transparent border          
            weight={1} // Thinner border
          />
          <Marker position={circleCenter} icon={customIcon} />
        </>
      )}
      <MapScroller singleTripId={singleTrip ? singleTrip.id : ''} multipleTrips={visibleTrips || []} />
      <MapEvents /> {/* This now safely includes all map-related hooks */}
    </MapContainer>
  );
}
