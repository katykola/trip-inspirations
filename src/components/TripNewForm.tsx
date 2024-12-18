import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, Grid } from '@mui/material';
import MapWithCoordinates from './MapWithCoordinates';

interface TripNewFormProps {
  onBack: () => void;
  onSubmit: (data: any, reset: () => void) => void;
}

const tripNewSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  url: z.string()
    .optional()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: 'Invalid URL',
    }),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export default function TripNewForm({ onBack, onSubmit }: TripNewFormProps) {
  const methods = useForm({
    resolver: zodResolver(tripNewSchema)
  });
  const { register, handleSubmit, formState: { errors }, reset } = methods;
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleFormSubmit = (data: any) => {
    if (coordinates) {
      data.lat = coordinates.lat;
      data.lng = coordinates.lng;
    }
    onSubmit(data, reset);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title ? 'Title is required.' : ''}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                {...register('description')}
              />
              <TextField
                label="Link"
                variant="outlined"
                fullWidth
                {...register('url')}
                error={!!errors.url}
                helperText={errors.url ? String(errors.url.message) : ''}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <MapWithCoordinates
              coordinates={coordinates}
              setCoordinates={setCoordinates}
              error={!!errors.coordinates}
              helperText={errors.coordinates ? 'Please enter the address or select coordinates from the map.' : ''}
            />
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Button onClick={onBack} variant='contained'>Back</Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}