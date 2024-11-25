import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import { divIcon } from 'leaflet';
import markerIconUrl from '../images/marker-icon.png'; // Import the image
import MarkerClusterGroup from 'react-leaflet-cluster';
import { db } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { Typography } from '@mui/material';

interface Trip {
  id: string;
  title: string;
  link: string;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  id: string;
  title: string;
  link: string;
  onTripSelect: (id: string) => void;
}

export default function MapComponent ({ id, onTripSelect }: MapComponentProps) {

  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const getTrips = async () => {
      try {
        const data = await getDocs(collection(db, 'DUMMY_DATA'));
        const filteredData = data.docs.map((doc) => {
          const tripData = doc.data();
          return {
            id: doc.id,
            title: tripData.title,
            link: tripData.link,
            lat: tripData.coordinates._lat,
            lng: tripData.coordinates._long,
            notes: tripData.notes,
          } as Trip;
        });
        setTrips(filteredData);
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

// Cluster custom icon + styling

  // const createClusterCustomIcon = (cluster: any) => {
  //   return L.divIcon({
  //     html: `<span>${cluster.getChildCount()}</span>`,
  //     className: 'custom-cluster-icon',
  //     iconSize: L.point(40, 40, true),
  //   });
  // };

  // const clusterIconStyle = `
  //   .custom-cluster-icon {
  //     background-color: rgba(255, 255, 255, 0.8);
  //     border-radius: 50%;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     font-size: 16px;
  //     font-weight: bold;
  //     color: #000;
  //     border: 2px solid #007bff;
  //     width: 40px;
  //     height: 40px;
  //     box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  //   }
  // `;

  const handleClick = () => {
    onTripSelect(id);
    console.log('Selected Trip ID:', id);
  };

  return (
    
    <MapContainer center={[48.80556, 16.6378]} zoom={13} style={{ height: 'calc(100vh - 4rem)', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        chunkedLoading
        // iconCreateFunction={createClusterCustomIcon}
      >
        {trips.map((trip) => (
          <Marker key={trip.id} position={[trip.lat, trip.lng]} icon={markerIcon}>
            <Popup>
              <Typography onClick={handleClick}>{trip.title}</Typography>
              <a href={trip.link} target="_blank" rel="noopener noreferrer">{trip.link}</a><br />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );

};
