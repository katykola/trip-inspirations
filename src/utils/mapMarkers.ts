import markerIconUrl from '../images/marker-icon.png';
import greenMarkerIconUrl from '../images/greenMarkerIconUrl.png'; // Add a green marker icon
import L from 'leaflet';

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

  export { markerIcon, greenMarkerIcon };