import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { TextField, Button, Stack, Grid, Typography, Checkbox, Box, TextareaAutosize } from '@mui/material';
import MapWithCoordinates from './MapWithCoordinates';

interface TripScraperFormProps {
  onBack: () => void;
  onSubmit: (data: any, reset: () => void) => void;
  scrapedData: { title: string; description: string; images: string[] } | null;
  url: string;
}

export default function TripScraperForm({ onBack, onSubmit, scrapedData, url }: TripScraperFormProps) {
  const methods = useForm();
  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = methods;
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);


  const handleImageCheckboxChange = (image: string) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(image)
        ? prevSelectedImages.filter((img) => img !== image)
        : [...prevSelectedImages, image]
    );
  };

  const handleFormSubmit = (data: any) => {
    data.images = selectedImages;
    data.url = url; // Add the URL to the submitted data
    if (coordinates) {
      data.lat = coordinates.lat;
      data.lng = coordinates.lng;
    }
    onSubmit(data, reset);
    reset(); // Reset the form fields after submission
    setSelectedImages([]); // Reset the selected images
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
                      <Grid item xs={6} sm={4} key={index}>
                        <Box sx={{ position: 'relative' }}>
                          <img src={image} alt={`Scraped image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                          <Checkbox
                            checked={selectedImages.includes(image)}
                            onChange={() => handleImageCheckboxChange(image)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              color: 'white',
                              '& .MuiSvgIcon-root': {
                                backgroundColor: 'white',
                              }, 
                            }}
                          />
                        </Box>
                      </Grid>
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