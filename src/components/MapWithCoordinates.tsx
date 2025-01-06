import { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useFormContext } from 'react-hook-form';
import '../styles/MapWithCoordinates.css'; // Import the custom CSS file


interface MapWithCoordinatesProps {
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (coordinates: { lat: number; lng: number }) => void;
  error: boolean;
  helperText: string;
}

const MapWithCoordinates: React.FC<MapWithCoordinatesProps> = ({ coordinates, setCoordinates, error, helperText }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(coordinates);
  const { setValue } = useFormContext();

  useEffect(() => {
    if (coordinates) {
      setPosition(coordinates);
    }
  }, [coordinates]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const newCoordinates = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPosition(newCoordinates);
        setCoordinates(newCoordinates);
        setValue('coordinates', newCoordinates);
      },
    });

    return position === null ? null : (
      <Marker position={position} draggable={true} eventHandlers={{
        dragend: (event) => {
          const marker = event.target;
          const newPosition = marker.getLatLng();
          const newCoordinates = { lat: newPosition.lat, lng: newPosition.lng };
          setPosition(newCoordinates);
          setCoordinates(newCoordinates);
          setValue('coordinates', newCoordinates);
        },
      }}></Marker>
    );
  };

  return (
    <Box sx={{ position: 'relative', height: '400px' }}>
      <TextField
        label="Location"
        variant="outlined"
        fullWidth
        value={coordinates ? `${coordinates.lat}, ${coordinates.lng}` : ''}
        onChange={(e) => {
          const [lat, lng] = e.target.value.split(',').map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setCoordinates({ lat, lng });
          }
        }}
        error={error}
        helperText={helperText}
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000, width: 'calc(100% - 32px)', backgroundColor: 'white', borderRadius: 2 }}
      />
      <MapContainer 
        center={[48.80556, 16.6378]} 
        zoom={13} 
        zoomControl={false} // Disable the default zoom control
        style={{ height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        <LocationMarker />
      </MapContainer>
    </Box>
  );
};

export default MapWithCoordinates;