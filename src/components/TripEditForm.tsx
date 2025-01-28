import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useImageSelection } from '../hooks/useImageSelection';
import schemaEdit from '../utils/schemaEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTrip } from '../hooks/useTrip';
import { Trip } from '../types/types';
import { db } from '../config/firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import { Typography, TextField, Stack, Button, Grid, useMediaQuery } from '@mui/material';
import ImagesCheckboxComponent from './ImagesChecboxComponent';
import MapWithCoordinates from './MapWithCoordinates';
import { smallScreenBreakpoint } from '../utils/breakpoints'
import AddToCollection from './AddToCollection';


export default function TripEditForm() {

    const isMobile = useMediaQuery(smallScreenBreakpoint);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();    
    const { data: trip, isLoading } = useTrip(id || '');
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);    
    const { selectedImages, handleImageCheckboxChange } = useImageSelection(trip?.images || []); // Initialize with trip.images
    const [ collectionId, setCollectionId ] = useState<string | null>(null);


   const methods = useForm<Trip>({
        resolver: zodResolver(schemaEdit)
    });
    
    const { register, handleSubmit, formState: { errors }, reset } = methods;

    useEffect(() => {
        if (trip) {
            reset({
                title: trip.title,
                description: trip.description,
                url: trip.url,
                images: trip.images,
                lat: trip.lat,
                lng: trip.lng,
            });
            setCoordinates({ lat: trip.lat, lng: trip.lng });
            setCollectionId(trip.collection);
        };
    }, [trip]);

    async function handleFormSubmit(data: Trip) {
        
        if (!trip) {
            console.error('Trip data is not available.');
            return;
        }
        
        if(!coordinates){
            console.error('Coordinates are not available');
            return;
        }
        
        // Merge the updated data with the existing trip data
        const updatedTrip = {
            ...trip, // Keep existing data
            ...data, // Override with form data
            images: selectedImages.length > 0 ? selectedImages : trip.images, // Use selected images if available
            lat: coordinates ? coordinates.lat : trip.lat, // Update latitude if coordinates are provided
            lng: coordinates ? coordinates.lng : trip.lng, // Update longitude if coordinates are provided
            collection: collectionId ? collectionId : trip.collection // Update collection if selected
        };

        
        try {
            // Update Firestore document
            const docRef = doc(db, 'trips', id || '');
            await updateDoc(docRef, updatedTrip);
    
            // Navigate back to trip details page
            navigate(`/trip/${id}`);
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    }

    function onBack(){
        navigate(`/trip/${id}`);
    }

    if (!id) {
        return <Typography variant="h6" color="error">Trip ID not found in URL.</Typography>;
    }

    if(!trip){
        return(
            <Typography variant="h6" color="error">Trip not found.</Typography>
        )
    }

    if(isLoading){
        return <Typography variant="body1">Loading...</Typography>
    }

    const getCollectionId = (collectionId: string) => {
        setCollectionId(collectionId);
    };

    return(
    <Stack spacing={2} sx={{ p: 3, width: '100%', mt: isMobile ? '3rem' : 0 }}>
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Grid container spacing={3}>
               <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        <TextField
                            label='Title'
                            variant='outlined'
                            fullWidth
                            sx={{
                                backgroundColor: 'white'
                            }}
                            {...register('title')}
                            error={!!errors.title}
                            helperText={errors.title ? 'Title is required.' : ''}
                        >
                        </TextField>
                        <TextField
                            label='Description'
                            variant='outlined'
                            fullWidth
                            sx={{
                                backgroundColor: 'white'
                            }}
                            multiline
                            rows={6}
                            {...register('description')}
                        >
                        </TextField>
                        <TextField
                            label='Link'
                            variant='outlined'
                            fullWidth
                            sx={{
                                backgroundColor: 'white'
                            }}
                            {...register('url')}
                        >
                        </TextField>
                        <Stack>
                            <Typography sx={{ textAlign: 'left' }}>Select up to 6 images:</Typography>
                            <Grid container spacing={2} >
                                {trip.images.slice(0, 6).map((image, index) => (
                                <ImagesCheckboxComponent key={index} index={index} image={image} selectedImages={selectedImages} handleImageCheckboxChange={handleImageCheckboxChange} />
                                ))}
                            </Grid>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                {errors.coordinates && !coordinates && <Typography color="error" sx={{ textAlign: 'left', fontSize: '0.8rem', ml: '14px' }}>Enter address or select coordinates</Typography>}
                    <MapWithCoordinates
                    coordinates={coordinates}
                    setCoordinates={setCoordinates} 
                    />
    
              <Stack sx={{ mt: 2, alignItems: 'flex-end' }}>
                <AddToCollection getCollectionId={getCollectionId} initialCollectionId={collectionId}/>
              </Stack>               
              </Grid>
              </Grid>
            <Stack direction='row' sx={{ justifyContent: 'space-between', mt: 2  }}>
                <Button onClick={onBack} variant='outlined'>Back</Button>
                <Button type="submit" variant="contained" color="primary">Save</Button>
            </Stack>
            </form>
        </FormProvider>
    </Stack>
    )
}