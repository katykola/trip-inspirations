import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from '../images/marker-icon.png';
import greenMarkerIconUrl from '../images/greenMarkerIconUrl.png'; // Add a green marker icon
import { Trip } from '../types/types';
import { useTrip } from '../hooks/useTrip';
import { useTrips } from '../hooks/useTrips';
import'../styles/MapWithCoordinates.css';

interface MapComponentProps {
  selectedTripId?: string | null;
  trips?: Trip[];
}

function MapComponent({ trips, selectedTripId = null }: MapComponentProps) {

  const [fetchedTrips, setFetchedTrips] = useState<Trip[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const { data: singleTrip, isLoading: singleTripLoading } = useTrip(selectedTripId || '');
  const { data: multipleTrips, isLoading: multipleTripsLoading } = useTrips();
  const navigate = useNavigate();
  
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
  
  if (singleTripLoading || multipleTripsLoading) {
    return <div>Loading...</div>;
  }

  //Get current location

  useEffect(() => {
    if (navigator.geolocation && !initialLocationSet) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
          setInitialLocationSet(true);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setInitialLocationSet(true);
        }
      );
    }
  }, [initialLocationSet]);

  //Set a single trip or more trips

  useEffect(() => {
    if (selectedTripId && singleTrip) {
      console.log('Single Trip:', singleTrip);
      setFetchedTrips([singleTrip]);
    } else if (multipleTrips) {
      setFetchedTrips(multipleTrips);
    }
  }, [selectedTripId, singleTrip, trips, multipleTrips]);

  //Handle click on a marker

  const handleClick = (id: string) => {
      console.log('Selected Trip ID:', id);
      navigate(`/trip/${id}`);
  };

  //Set the center of the map

  // const center: [number, number] = currentLocation ? currentLocation : selectedTripId && singleTrip ? [singleTrip?.lat, singleTrip?.lng] : [49.195061, 16.606836];

  const center : [number, number] = selectedTripId && singleTrip ? [singleTrip?.lat, singleTrip?.lng] : currentLocation ? currentLocation : [49.195061, 16.606836];


  return (
    <MapContainer center={center} zoom={10} style={{ height: 'calc(100vh - 4rem)', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup >
      {fetchedTrips.map((trip) => (
        <Marker
          key={trip.id}
          position={[trip.lat, trip.lng]}
          icon={trip.id === selectedTripId ? greenMarkerIcon : markerIcon}
          eventHandlers={{ click: () => handleClick(trip.id) }}
        >
          {/* <Popup>
            <Typography variant="body2">{trip.title}</Typography>
            <Box><img src={trip.images[0]} style={{ width: '100%' }}></img></Box>
          </Popup> */}
        </Marker>
      ))}
      </MarkerClusterGroup>
      <MapScroller selectedTripId={selectedTripId} fetchedTrips={fetchedTrips} currentLocation={currentLocation}/>
    </MapContainer>
  );
}

interface MapScrollerProps {
  selectedTripId: string | null;
  fetchedTrips: Trip[];
  currentLocation: [number, number] | null;
}

function MapScroller({ selectedTripId, fetchedTrips, currentLocation }: MapScrollerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedTripId) {
      const selectedTrip = fetchedTrips.find(trip => trip.id === selectedTripId);
      if (selectedTrip) {
        map.flyTo([selectedTrip.lat, selectedTrip.lng], 0);
      }
    }
  }, [selectedTripId, fetchedTrips, map]);

  useEffect(() => {
    if (currentLocation) {
      map.setView(currentLocation, 10);
    }
  }, [currentLocation, map]);

  return null;
}

export default MapComponent;