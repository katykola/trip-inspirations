import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useImageSelection } from '../hooks/useImageSelection';
import { TextField, Button, Stack, Grid, Typography, TextareaAutosize } from '@mui/material';
import MapWithCoordinates from '../components/MapWithCoordinates';
import ImagesCheckboxComponent from '../components/ImagesChecboxComponent';
import { useLocation } from '../context/LocationContext';


interface TripScraperFormProps {
  onBack: () => void;
  scrapedData: { title: string; description: string; images: string[] } | null;
  url: string;
  onSubmit: (data: any, reset: () => Promise<string | undefined>) => Promise<string | undefined>;
}

export default function TripScraperForm({ onBack, onSubmit, scrapedData, url }: TripScraperFormProps) {

  const navigate  = useNavigate();
  const methods = useForm();
  const { register, handleSubmit, formState: { errors }, reset } = methods;
  const { selectedImages, handleImageCheckboxChange } = useImageSelection();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { setSearchedLocation } = useLocation();

  const handleFormSubmit = async (data: any) => {
    data.images = selectedImages;
    data.url = url; // Add the URL to the submitted data
    if (coordinates) {
      data.lat = coordinates.lat;
      data.lng = coordinates.lng;
      setSearchedLocation([coordinates.lat, coordinates.lng]);
      delete data.coordinates;
    }  
    const newTripId = await onSubmit(data, async () => {
      reset();
      return undefined;
    });
    if (newTripId) {
      navigate(`/trip/${newTripId}`); // Navigate to the new trip's detail page
    }
    reset(); // Reset the form fields after submission
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
                defaultValue={scrapedData?.title}
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title ? 'Please select coordinates from the map.' : ''}
              />
              <TextareaAutosize
                minRows={6}
                placeholder="Popis"
                defaultValue={scrapedData?.description}
                {...register('description')}
                style={{ width: '100%', padding: '16.5px 14px', fontSize: '16px', borderColor: errors.description ? 'red' : 'rgba(0, 0, 0, 0.23)', borderRadius: '4px' }}
              />
              {errors.description && <Typography color="error">Please provide a description.</Typography>}
              {scrapedData?.images && scrapedData.images.length > 0 && (
                <>
                  <Grid container spacing={2}>
                    {scrapedData.images.slice(0, 6).map((image, index) => (
                      <ImagesCheckboxComponent key={index} index={index} image={image} selectedImages={selectedImages} handleImageCheckboxChange={handleImageCheckboxChange} />
                    ))}
                  </Grid>
                </>
              )}
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