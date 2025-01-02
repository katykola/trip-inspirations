import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, CircularProgress, Link as LinkHref } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Trip } from '../types/types';
import Nature from '../images/nature.jpg';
import { useLocation } from '../context/LocationContext';

 
interface TripDetailProps {
  id: string;
}

export default function TripDetail({ id }: TripDetailProps) {

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { setSelectedLocation } = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if(trip){
      setSelectedLocation([trip?.lat, trip?.lng])
    }
  }, [trip]);

  function onBack() {
    navigate('/');
  }

  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'trips', id);
      await deleteDoc(docRef);
      console.log('Document successfully deleted!');
      navigate('/'); // Navigate back to the trips list after deletion
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

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
        <LinkHref href={trip.url} target="_blank" rel="noopener noreferrer">
          {trip.url}
        </LinkHref>        
        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to={`/trip/${id}/edit`}><Button variant='contained'>Edit</Button></Link>
            <Button variant='contained' onClick={handleDelete}>Delete</Button>
        </Stack>
        </Stack>
    )
}