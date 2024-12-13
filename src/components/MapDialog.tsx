import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (coordinates: { lat: number; lng: number }) => void;
}

const MapDialog: React.FC<MapDialogProps> = ({ open, onClose, onSelect }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (event) => {
            const marker = event.target;
            const newPosition = marker.getLatLng();
            setPosition(newPosition);
          },
        }}
      ></Marker>
    );
  };

  const handleSelect = () => {
    if (position) {
      onSelect(position);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Location</DialogTitle>
      <DialogContent>
        <MapContainer center={[48.80556, 16.6378]} zoom={13} style={{ height: '400px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSelect} disabled={!position}>Select</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapDialog;