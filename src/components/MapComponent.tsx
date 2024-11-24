import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { divIcon } from 'leaflet';
import markerIconUrl from '../images/marker-icon.png'; // Import the image
import MarkerClusterGroup from 'react-leaflet-cluster';

export default function MapComponent () {

  const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const markers = [
    { 
      lat: 48.80556, 
      lng: 16.6378,
      popup: {
        title: 'Marker 2',
        text: 'This is a custom popup text',
      },    
    },
    { lat: 48.80320, 
      lng: 16.6320,
      popup: {
        title: 'Marker 2',
        text: 'This is a custom popup text',
      },
    },
    { lat: 48.80320, 
      lng: 16.6320,
      popup: {
        title: 'Marker 3',
        text: 'This is a custom popup text',
      },    
    }
  ]

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
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={markerIcon}>
          <Popup>
          <h3>{marker.popup.title}</h3>
          {marker.popup.text}          
          </Popup>
        </Marker>
      ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
