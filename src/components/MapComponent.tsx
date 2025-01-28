import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { MapContainer, TileLayer, Marker, Circle, ZoomControl, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../hooks/useTrip';
import { Trip } from '../types/types';
import '../styles/MapWithCoordinates.css';
import MapScroller from './MapScroller';
import { useLocation } from '../context/LocationContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { smallScreenBreakpoint } from '../utils/breakpoints';
import { headerHeight, menuBarHeight } from '../utils/styling';
import L from 'leaflet';

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


interface MapComponentProps {
  areaSearched: boolean;
  setAreaSearched: (areaSearched: boolean) => void;
  setShowAreaButton: (showAreaButton: boolean) => void;
}

export default function MapComponent({areaSearched, setAreaSearched, setShowAreaButton}:MapComponentProps) {
  const { id } = useParams();
  const isMobile = useMediaQuery(smallScreenBreakpoint);
  
  const navigate = useNavigate();
  const { data: singleTrip, isLoading: singleTripLoading } = useTrip(id || '');
  const { selectedLocation, setSelectedLocation, currentLocation, mapRadius, zoom, setZoom, searchedLocation, setSearchedLocation } = useLocation();
  const { visibleTrips, isLoading: visibleTripsLoading } = useVisibleTrips();
  
  const [mapKey, setMapKey] = useState(0); // State variable to manage the key for MapContainer

  const [areaCenter, setAreaCenter] = useState<[number, number] | null>(null);
  
  const center: [number, number] = selectedLocation || currentLocation || [48.210033, 16.363449];
  const circleCenter = searchedLocation || currentLocation || [48.210033, 16.363449];

  function resetMap(zoom: number) {
    setZoom(zoom);
    if (searchedLocation) {
      setSelectedLocation(searchedLocation);
    }    
    setMapKey((prevKey) => prevKey + 1); 
  }

  const mapRef = useRef<L.Map>(null);

  const MapEvents = () => {
    useMapEvents({
      moveend: () => {
        if (mapRef.current && !id) {
          const newCenter = mapRef.current.getCenter();
          setShowAreaButton(true);
          setAreaCenter([newCenter.lat, newCenter.lng]);
        }
      },
    });
    return null;
  };

  useEffect(() => {
    if(areaCenter && areaSearched === true){
      setSearchedLocation(areaCenter);
      setMapKey((prevKey) => prevKey + 1); 
      setShowAreaButton(false);
      setAreaSearched(false);
    }
  }, [areaSearched, areaCenter, setAreaSearched, setShowAreaButton, setSearchedLocation]);


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
  }, [searchedLocation, setSelectedLocation]);

  useEffect(() => {
    if (mapRadius === 7000) {
      resetMap(12);
    } else if (mapRadius === 15000) {
      resetMap(11);
    } else if (mapRadius === 30000) {
      resetMap(10);
    } else if (mapRadius === 60000) {
      resetMap(9);
    } else if (mapRadius === 120000) {
      resetMap(8);
    } else if (mapRadius === 240000) {
      resetMap(7);
    } else if (mapRadius === 480000) {
      resetMap(6);
    } 
  }, [mapRadius]);
  

  
  if (singleTripLoading || visibleTripsLoading) {
    return <div>Loading...</div>;
  }
  
  const handleClick = (id: string) => {
    navigate(`/trip/${id}`); // Navigate to trip detail page
  };

  const customIcon = L.divIcon({
    className: 'custom-center-icon',
    html: '<div style="font-size: 20px; color: #333333">x</div>',
  });

  return (
    <>
      <MapContainer
       ref={mapRef}
        key={mapKey} // Use the key to force reload
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false} // Disable the default zoom control
          style={{
          height: isMobile ? '100vh' : `calc(100vh - (${headerHeight} + ${menuBarHeight}))`,
          width: '100%',
        }}
        >
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        { !isMobile && <ZoomControl position="topright" />}
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
          fillOpacity={0.05} 
          opacity={0.4} 
          weight={1} 
          />
          <Marker position={circleCenter as L.LatLngExpression} icon={customIcon} />
        </>
        )}
        <MapScroller
          singleTripId={singleTrip ? singleTrip.id : ''}
          setShowAreaButton={setShowAreaButton}
        />
        <MapEvents />
      </MapContainer>
    </>
  );
}
