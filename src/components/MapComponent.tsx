import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../hooks/useTrip';
import { Trip } from '../types/types';
import '../styles/MapWithCoordinates.css';
import MapScroller from './MapScroller';
import { useLocation } from '../context/LocationContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { headerHeight, menuBarHeight } from '../config/styling';
import L from 'leaflet';

// Fix for default icon paths
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useState } from 'react';

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
  const { selectedLocation, setSelectedLocation, currentLocation, mapRadius, zoom, setZoom, searchedLocation } = useLocation();
  const [currentMapRadius] = useState(mapRadius);
  const { visibleTrips, isLoading: visibleTripsLoading } = useVisibleTrips();

  const [mapKey, setMapKey] = useState(0); // State variable to manage the key for MapContainer

  const center: [number, number] = selectedLocation || currentLocation || [48.210033, 16.363449];
  const circleCenter = searchedLocation || currentLocation || [48.210033, 16.363449];

  function resetMap(zoom: number) {
    setZoom(zoom);
    if (searchedLocation) {
      setSelectedLocation(searchedLocation);
    }    
    navigate('/');
    setMapKey((prevKey) => prevKey + 1); 
  }

  useEffect(() => {
    if(visibleTrips){
      setMapKey((prevKey) => prevKey + 1); 
    } 
  }, [visibleTrips]);

  useEffect(() => {
    if (searchedLocation) {
      setSelectedLocation(searchedLocation);
    }
    setMapKey((prevKey) => prevKey + 1); 

  }, [searchedLocation]);

  useEffect(() => {
    if (currentMapRadius !== mapRadius && mapRadius === 5000) {
      resetMap(12);
    } else if (currentMapRadius !== mapRadius && mapRadius === 10000) {
      resetMap(11);
    } else if (currentMapRadius !== mapRadius && mapRadius === 30000) {
      resetMap(9);
    } else if (currentMapRadius !== mapRadius && mapRadius === 50000) {
      resetMap(8);
    } else if (currentMapRadius !== mapRadius && mapRadius === 100000) {
      resetMap(7);
    } else if (currentMapRadius !== mapRadius && mapRadius === 300000) {
      resetMap(6);
    } else if (currentMapRadius !== mapRadius && mapRadius === 500000) {
      resetMap(5);
    }
  }, [mapRadius]);

  
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


  return (
    <MapContainer
      key={mapKey} // Use the key to force reload
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={false} // Disable the default zoom control
      style={{ height: `calc(100vh - (${headerHeight} + ${menuBarHeight}))`, width: '100%' }}
        >
      <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="topright" />
      <MarkerClusterGroup>
      {visibleTrips.map((trip: Trip) => (
        <Marker
        key={trip.id}
        position={[trip.lat, trip.lng] as L.LatLngExpression}
        eventHandlers={{
          click: () => handleClick(trip.id),
        }}
        />
      ))}
      </MarkerClusterGroup>
      {center && (
      <>
        <Circle
        center={circleCenter as L.LatLngExpression}
        radius={mapRadius}
        color="black"
        fillColor="black"
        fillOpacity={0.05} // More transparent fill
        opacity={0.4} // More transparent border          
        weight={1} // Thinner border
        />
        <Marker position={circleCenter as L.LatLngExpression} icon={customIcon} />
      </>
      )}
      <MapScroller 
        singleTripId={singleTrip ? singleTrip.id : ''} 
        multipleTrips={visibleTrips || []} 
      />
    </MapContainer>
  );
}
