import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Link, Button, CircularProgress } from '@mui/material';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { Trip } from '../types/types';
import Nature from '../images/nature.jpg';
 
interface TripDetailProps {
  id: string;
  trips: Trip[];
  onBack: () => void;
}

export default function TripDetail({ id, onBack }: TripDetailProps) {

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTrip = async () => {
      try {
        const docRef = doc(db, 'trips', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTrip({
            id: docSnap.id,
            ...docSnap.data(),
          } as Trip);      
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error getting document: ', error);
      }
      finally {
        setLoading(false);
      }
    };
    getTrip();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Trip not found.
        </Typography>
        <Button onClick={onBack} variant="contained" sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  console.log('Trip:', trip.id);
  console.log('Images:', trip.images);
      
    return(
        <Stack spacing={3} sx={{ p: 3 }}>
        <Button onClick={onBack}>Back to List</Button>
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <img
          src={trip.images && trip.images.length > 0 ? trip.images[0] : Nature}
          alt="Trip Image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Stack direction='row' spacing={1}>
        {trip.images && trip.images.length > 0 ?
        (trip.images.slice(1).map((image, index) => (
          <Box key={index} sx={{ width: '100%', overflow: 'hidden' }}>
          <img
          src={image}
          alt={`Trip Image ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          </Box>
        )))
        : null
      }
      </Stack>        
      <Typography variant="body1">{trip.title}</Typography>
        <Typography variant="body2">{trip.description}</Typography>
        <Link href={trip.url} target="_blank" rel="noopener noreferrer">
          {trip.url}
        </Link>        
        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Button variant='contained'>Edit</Button>
            <Button variant='contained'>Delete</Button>
        </Stack>
        </Stack>
    )
}