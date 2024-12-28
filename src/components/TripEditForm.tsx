import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useImageSelection } from '../hooks/useImageSelection';
import { zodResolver } from '@hookform/resolvers/zod';
import tripNewSchema from '../utils/schemas';
import { Typography, TextField, Stack, Button, Grid } from '@mui/material';
import { useTrip } from '../hooks/useTrip';
import { Trip } from '../types/types';
import ImagesCheckboxComponent from './ImagesChecboxComponent';
import MapWithCoordinates from './MapWithCoordinates';
import { db } from '../config/firebase-config';
import { doc, updateDoc } from 'firebase/firestore';

interface TripScraperFormProps {
    onSubmit: (data: any, reset: () => void) => void;
  }

export default function TripEditForm({ onSubmit }: TripScraperFormProps) {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();    
    const { data: trip, isLoading } = useTrip(id || '');
    const { selectedImages, handleImageCheckboxChange } = useImageSelection();
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    const methods = useForm<Trip>({
        resolver: zodResolver(tripNewSchema)
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
                lng: trip.lng
            });
            setCoordinates({ lat: trip.lat, lng: trip.lng });
        }
    }, [trip]);


    async function handleFormSubmit(data: Trip){
        data.images = selectedImages;
        if (coordinates) {
            data.lat = coordinates.lat;
            data.lng = coordinates.lng;
        }
        try {
            const docRef = doc(db, 'trips', id || '');
            await updateDoc(docRef, { ...data });
            console.log('Document successfully updated!');
          } catch (error) {
            console.error('Error updating document: ', error);
          }
        onSubmit(data, reset);
        reset();
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


    return(
        <>
        <Typography variant="h4">Edit Trip</Typography>
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Grid container spacing={3}>
               <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        <TextField
                            label='Title'
                            variant='outlined'
                            fullWidth
                            {...register('title')}
                            error={!!errors.title}
                            helperText={errors.title ? 'Title is required.' : ''}
                        >
                        </TextField>
                        <TextField
                            label='Description'
                            variant='outlined'
                            fullWidth
                            multiline
                            rows={6}
                            {...register('description')}
                        >
                        </TextField>
                        <TextField
                            label='Link'
                            variant='outlined'
                            fullWidth
                            {...register('url')}
                        >
                        </TextField>
                        <Grid container spacing={2}>
                            {trip.images.slice(0, 6).map((image, index) => (
                            <ImagesCheckboxComponent key={index} index={index} image={image} selectedImages={selectedImages} handleImageCheckboxChange={handleImageCheckboxChange} />
                            ))}
                        </Grid>
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
        </>
    )
}