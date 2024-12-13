import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from '../images/marker-icon.png';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { db } from '../config/firebase-config';
import { collection, getDocs, GeoPoint } from 'firebase/firestore';
import { Typography } from '@mui/material';

interface Trip {
  id: string;
  title: string;
  link: string;
  lat: number;
  lng: number;
  notes: string;
}

interface MapComponentProps {
  trips: Trip[];
  onTripSelect: (id: string) => void;
}

export default function MapComponent({ trips, onTripSelect }: MapComponentProps) {
  const [fetchedTrips, setFetchedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const getTrips = async () => {
      try {
        const data = await getDocs(collection(db, 'DUMMY_DATA'));
        const filteredData = data.docs.map((doc) => {
          const tripData = doc.data();
          const coordinates = tripData.coordinates as GeoPoint;
          return {
            id: doc.id,
            title: tripData.title,
            link: tripData.link,
            lat: coordinates.latitude,
            lng: coordinates.longitude,
            notes: tripData.notes,
          } as Trip;
        });
        setFetchedTrips(filteredData);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };
    getTrips();
  }, []);

  const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const handleClick = (id: string) => {
    onTripSelect(id);
    console.log('Selected Trip ID:', id);
  };

  return (
    <MapContainer center={[48.80556, 16.6378]} zoom={13} style={{ height: 'calc(100vh - 4rem)', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup chunkedLoading>
        {fetchedTrips.map((trip) => (
          <Marker key={trip.id} position={[trip.lat, trip.lng]} icon={markerIcon}>
            <Popup>
              <Typography onClick={() => handleClick(trip.id)}>{trip.title}</Typography>
              <a href={trip.link} target="_blank" rel="noopener noreferrer">{trip.link}</a><br />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}