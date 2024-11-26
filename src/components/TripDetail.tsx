import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Link, Button, CircularProgress } from '@mui/material';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

interface Trip {
    id: string;
    title: string;
    notes: string;
    link: string;
  }
  
  interface TripDetailProps {
    id: string;
    onBack: () => void;
  }

export default function TripDetail({ id, onBack }: TripDetailProps) {

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTrip = async () => {
      try {
        const docRef = doc(db, 'DUMMY_DATA', id);
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
      
    return(
        <Stack spacing={3} sx={{ p: 3 }}>
        <Button onClick={onBack}>Back to List</Button>
        <Box sx={{ width: '100%',  overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1659282130892-7538aa7f804d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxhbHBzfGVufDB8MHwwfHx8Mg%3D%3D"
            alt="Trip Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Stack direction='row' spacing={1}>
        <Box sx={{  }}>
          <img
            src="https://images.unsplash.com/photo-1659282130892-7538aa7f804d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxhbHBzfGVufDB8MHwwfHx8Mg%3D%3D"
            alt="Trip Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{  }}>
          <img
            src="https://images.unsplash.com/photo-1659282130892-7538aa7f804d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxhbHBzfGVufDB8MHwwfHx8Mg%3D%3D"
            alt="Trip Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>        
        <Box sx={{  }}>
          <img
            src="https://images.unsplash.com/photo-1659282130892-7538aa7f804d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxhbHBzfGVufDB8MHwwfHx8Mg%3D%3D"
            alt="Trip Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        </Stack>
        <Typography variant="body1">{trip.title}</Typography>
        <Typography variant="body2">{trip.notes}</Typography>
        <Link>{trip.link}</Link>
        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Button variant='contained'>Editovat</Button>
            <Button variant='contained'>Smazat</Button>
        </Stack>
        </Stack>
    )
}