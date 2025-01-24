import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import schemaNew from '../utils/schemaNew';
import { z } from 'zod';
import { useImageSelection } from '../hooks/useImageSelection';
import { TextField, Button, Stack, Grid, Typography, TextareaAutosize, Box } from '@mui/material';
import MapWithCoordinates from '../components/MapWithCoordinates';
import ImagesCheckboxComponent from '../components/ImagesChecboxComponent';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types/types';
import { db } from '../config/firebase-config';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import AddToCollection from '../components/AddToCollection';


interface TripScraperFormProps {
  onBack: () => void;
  scrapedData: { title: string; description: string; images: string[] } | null;
  url: string;
  onSubmit: (data: Trip, reset: () => Promise<string | undefined>) => Promise<string | undefined>;
}

export default function TripScraperForm({ onBack, onSubmit, scrapedData, url }: TripScraperFormProps) {

  const navigate = useNavigate();
  const methods = useForm<z.infer<typeof schemaNew>>({
    resolver: zodResolver(schemaNew),
    defaultValues: {
      title: scrapedData?.title || '', // Ensure a valid fallback value
      description: scrapedData?.description || '',
      url: url,
      images: [], // Default value for images
      coordinates: undefined, // Default to undefined
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, trigger } = methods;
  const { selectedImages, handleImageCheckboxChange } = useImageSelection();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { setSearchedLocation } = useLocation();
  const [ collectionId, setCollectionId ] = useState<string | null>(null);

  const { data: trips } = useTrips();

  const handleImageSelectionChange = (image: string) => {
    const updatedImages = selectedImages.includes(image)
      ? selectedImages.filter((selectedImage) => selectedImage !== image)
      : [...selectedImages, image];

    handleImageCheckboxChange(image); 
    setValue('images', updatedImages); 
    trigger('images'); 
  };

  const user = useAuth();

  const getCollectionId = (collectionId: string) => {
    setCollectionId(collectionId);
  };

  const handleFormSubmit = async (data: z.infer<typeof schemaNew>) => {
    console.log('handleSubmit');
    console.log('url', url);
    if (!url) {
      console.log('url is required')
      return;
    }
    if (Object.keys(errors).length > 0) {
      console.error('Validation errors:', errors);
    }
    console.log('Form submitted with:', data); // Check if this logs data
    data.images = selectedImages;
    data.url = url;
    if (user !== null && user.user !== null) {
      data.userId = user.user.uid;
    } 
    if (coordinates) {
      data.lat = coordinates.lat;
      data.lng = coordinates.lng;
      setSearchedLocation([coordinates.lat, coordinates.lng]);
      delete data.coordinates;
    } else {
      data.lat = data.lat ?? 0; // Ensure lat is always a number
      data.lng = data.lng ?? 0; // Ensure lng is always a number
    }
    if (!data.images || data.images.length === 0) {
      console.error('No images selected');
      return;
    }
    if(collectionId) {
      data.collections = [collectionId];
    }
    
    if (!coordinates) {
      console.error('Coordinates are required');
      return;
    }
    if (trips && url){
      const matchingTrips = trips.filter(trip => trip.url === url);
      if (matchingTrips.length > 0) {
        console.log('tripSaved');
      } else {
        console.log('No matching trips found');
      }
    }
    console.log('Form submitted:', data);
    const newTripId = await onSubmit(data as Trip, async () => {
      reset();
      return undefined;
    });

    if (newTripId) {
      console.log('Navigating to:', `/trip/${newTripId}`);
      if(collectionId){
        const collectionRef = doc(db, 'collections', collectionId);
          await updateDoc(collectionRef, {
            trips: arrayUnion(newTripId),
          });
      }
      navigate(`/trip/${newTripId}`); // Navigate to the new trip's detail page
    }
    
    reset(); // Reset the form fields after submission
  };

  return (
    <Stack sx={{ px: '2rem', py: '1rem', backgroundColor: 'grey.50' }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                  sx={{ backgroundColor: 'white' }}
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
              <AddToCollection getCollectionId={getCollectionId} initialCollectionId={collectionId}/>
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
    </Stack>
  );
}
