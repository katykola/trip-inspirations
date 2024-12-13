import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Stack, Grid, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface TripNewFormProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export default function TripNewForm({ onBack, onSubmit }: TripNewFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setValue('coordinates', `${e.latlng.lat}, ${e.latlng.lng}`);
      },
    });

    return position === null ? null : (
      <Marker position={position} draggable={true} eventHandlers={{
        dragend: (event) => {
          const marker = event.target;
          const newPosition = marker.getLatLng();
          setPosition(newPosition);
          setValue('coordinates', `${newPosition.lat}, ${newPosition.lng}`);
        },
      }}></Marker>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <TextField
              label="Název výletu"
              variant="outlined"
              fullWidth
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title ? 'Please select coordinates from the map.' : ''}
            />
            <TextField
              label="Poznámka"
              variant="outlined"
              fullWidth
              {...register('notes')}
            />
            <TextField
              label="Coordinates"
              variant="outlined"
              fullWidth
              {...register('coordinates')}
              error={!!errors.coordinates}
              helperText={errors.coordinates ? 'Please select coordinates from the map.' : ''}
              InputProps={{
                readOnly: true,
              }}
            />
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Button onClick={onBack} variant='contained'>Zpět</Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <MapContainer center={[48.80556, 16.6378]} zoom={13} style={{ height: '400px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </Grid>
      </Grid>
    </form>
  );
}