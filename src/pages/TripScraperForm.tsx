import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import schemaNew from '../utils/schemaNew';
import { z } from 'zod';
import { useImageSelection } from '../hooks/useImageSelection';
import { TextField, Button, Stack, Grid, Typography, TextareaAutosize, Checkbox, FormControlLabel, Box } from '@mui/material';
import MapWithCoordinates from '../components/MapWithCoordinates';
import ImagesCheckboxComponent from '../components/ImagesChecboxComponent';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';


interface TripScraperFormProps {
  onBack: () => void;
  scrapedData: { title: string; description: string; images: string[] } | null;
  url: string;
  onSubmit: (data: any, reset: () => Promise<string | undefined>) => Promise<string | undefined>;
}

export default function TripScraperForm({ onBack, onSubmit, scrapedData, url }: TripScraperFormProps) {
  const navigate = useNavigate();
  const methods = useForm<z.infer<typeof schemaNew>>({
    resolver: zodResolver(schemaNew),
    defaultValues: {
      images: [], // Default value for images
      coordinates: undefined, // Default to undefined
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, trigger } = methods;
  const { selectedImages, handleImageCheckboxChange } = useImageSelection();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { setSearchedLocation } = useLocation();
  const [checked, setChecked] = useState(false);

  // Handle checkbox change for public visibility
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // Update image selection and trigger validation
  const handleImageSelectionChange = (image: string) => {
    const updatedImages = selectedImages.includes(image)
      ? selectedImages.filter((selectedImage) => selectedImage !== image)
      : [...selectedImages, image];

    handleImageCheckboxChange(image); // Update the state in useImageSelection
    setValue('images', updatedImages); // Update the form state
    trigger('images'); // Trigger validation for the 'images' field
  };

  const user = useAuth();

  const handleFormSubmit = async (data: any) => {
    data.images = selectedImages;
    data.url = url; // Add the URL to the submitted data
    data.public = checked; // Add the public checkbox value to the submitted data
    if (user !== null && user.user !== null) {
      data.userId = user.user.uid;
    } 
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
      <form onSubmit={(handleSubmit(handleFormSubmit))}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField
                placeholder="Title"
                variant="outlined"
                fullWidth
                defaultValue={scrapedData?.title}
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title ? String(errors.title.message) : ''}
              />
              <Box>
                <TextareaAutosize
                  minRows={3}
                  placeholder="Description"
                  defaultValue={scrapedData?.description}
                  {...register('description')}
                  style={{
                    width: '100%',
                    padding: '16.5px 14px',
                    fontSize: '1rem',
                    borderColor: errors.description ? 'red' : 'rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    fontFamily: 'Roboto, sans-serif',
                    lineHeight: '1.5',
                  }}
                />
                {errors.description && (
                  <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.8rem', ml: '14px' }}>
                    {String(errors.description.message)}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography sx={{ textAlign: 'left' }}>Select up to 6 images:</Typography>
                {errors.images && (
                  <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.8rem', ml: '14px' }}>
                    {errors.images.message as string}
                  </Typography>
                )}
                {scrapedData?.images && scrapedData.images.length > 0 && (
                  <Grid container spacing={2} sx={{ ml: -2 }}>
                    {scrapedData.images.slice(0, 6).map((image, index) => (
                      <ImagesCheckboxComponent
                        key={index}
                        index={index}
                        image={image}
                        selectedImages={selectedImages}
                        handleImageCheckboxChange={handleImageSelectionChange}
                      />
                    ))}
                  </Grid>
                )}
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>

            <MapWithCoordinates
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label="Set trip visibility to public"
            />
          </Grid>
        </Grid>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
