import { useState } from 'react';
import {
  TextField,
  Box,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import L from 'leaflet'; // For custom marker icon
import 'leaflet/dist/leaflet.css';
import { useFormContext } from 'react-hook-form';
import '../styles/MapWithCoordinates.css'; // Import the custom CSS file
import { Search, Close } from '@mui/icons-material';
import { useLocation } from '../context/LocationContext';

// Fix for default marker icon in Leaflet
L.Icon.Default.prototype.options.iconRetinaUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
L.Icon.Default.prototype.options.iconUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
L.Icon.Default.prototype.options.shadowUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

interface MapWithCoordinatesProps {
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (coordinates: { lat: number; lng: number }) => void;
}

interface Suggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

const MapWithCoordinates: React.FC<MapWithCoordinatesProps> = ({
  coordinates,
  setCoordinates,
}) => {
  const { setValue } = useFormContext();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { currentLocation } = useLocation();

  const center: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : currentLocation || [48.210033, 16.363449];

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setQuery(value);
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        console.log(data);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (location: {
    lat: string;
    lon: string;
    display_name: string;
  }) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    // Update coordinates and form value
    setCoordinates({ lat, lng: lon });
    setValue('coordinates', { lat, lng: lon });

    // Update search query and close suggestions
    setQuery('');
    setShowSuggestions(false);
  };

  const handleMarkerDragEnd = (event: L.DragEndEvent) => {
    const marker = event.target as L.Marker;
    const position = marker.getLatLng();

    // Update coordinates and form value
    setCoordinates({ lat: position.lat, lng: position.lng });
    setValue('coordinates', { lat: position.lat, lng: position.lng });
  };

  const MapUpdater = ({ coordinates }: { coordinates: { lat: number; lng: number } | null }) => {
    const map = useMap();
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], 11); // Update map center
    }
    return null;
  };

  return (
    <>
    <Box sx={{ position: 'relative', height: '400px' }}>
      {/* Search Box */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
          width: 'calc(100% - 32px)',
          backgroundColor: 'white',
          borderRadius: 2,
        }}
      >
        <TextField
          placeholder="Search for a location"
          value={query}
          onChange={handleSearchChange}
          sx={{
            width: '100%',
            backgroundColor: 'white',
            maxHeight: '2.5rem',
            '& .MuiOutlinedInput-root': {
              height: '2.5rem',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {showSuggestions && (
          <List
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              zIndex: 1001,
              border: '1px solid lightgray',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {suggestions.map((suggestion: Suggestion) => (
              <ListItem key={suggestion.place_id} disablePadding>
                <ListItemButton
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <ListItemText primary={suggestion.display_name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        style={{ height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {coordinates && (
          <Marker
            position={[coordinates.lat, coordinates.lng]}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
          />
        )}
        <ZoomControl position="bottomright" />
        {/* Dynamically update map center */}
        <MapUpdater coordinates={coordinates} />
      </MapContainer>
    </Box>
    </>
  );
};

export default MapWithCoordinates;
