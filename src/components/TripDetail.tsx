import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, CircularProgress, Link as LinkHref, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Trip, Collection } from '../types/types';
import Nature from '../images/nature.jpg';
import { useLocation } from '../context/LocationContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import Slider from 'react-slick';
import { smallScreenBreakpoint } from '../utils/breakpoints'
import { ChevronLeft, OpenInNew } from '@mui/icons-material';
import { useCollection } from '../context/CollectionContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
 
interface TripDetailProps {
  id: string;
}

export default function TripDetail({ id }: TripDetailProps) {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [collectionName, setCollectionName] = useState<string | null>(null);
  const { setSelectedLocation } = useLocation();
  const navigate = useNavigate();
  const { setSelectedTripId, setTripDetailOpen } = useVisibleTrips();
  const { selectedCollection } = useCollection();

  useEffect(() => {
    const getTrip = async () => {
      try {
        const docRef = doc(db, 'trips', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const tripData = docSnap.data() as Trip;
          setTrip(tripData); 

        // Fetch the collection name by its ID
          if (tripData.collection) {
            const collectionId = tripData.collection; 
            const collectionRef = doc(db, 'collections', collectionId);
            const collectionSnap = await getDoc(collectionRef);
              if (collectionSnap.exists()) {
                const collectionData = collectionSnap.data() as Collection;
                setCollectionName(collectionData.title);
              } else {
            console.error('No such collection!');
          }
      }
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
      setSelectedLocation([trip?.lat, trip?.lng]);
      setSelectedTripId(trip.id);
    }
  }, [trip]);

  function onBack() {
    if(selectedCollection){
      setSelectedTripId(null);
    }
    setTripDetailOpen(false);
    navigate('/map');
  }

  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'trips', id);
      await deleteDoc(docRef);
      navigate('/map'); 
      window.location.reload(); // Reload the app
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
    {console.log('trip not found')};
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

  const displayUrl = trip.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

  console.log('trip', trip);

      
    return(
      <Stack spacing={3} sx={{ px: 3, py: 2, mt: isMobile ? '3rem' : 0 }}>
      <Stack onClick={onBack} direction='row' sx={{ cursor: 'pointer' }}>
        <ChevronLeft sx={{ color: 'grey', mr: 0.5, fontSize: '0.9rem', verticalAlign: 'bottom' }}/>
        <Typography sx={{ color: 'grey', fontSize: '0.9rem' }}>Back to List</Typography>
      </Stack>

      {isMobile? 
      
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        {trip.images && trip.images.length > 1 ? 
          <Slider {...settings}>
            {trip.images && trip.images.length > 1 ? (
              trip.images.map((image, index) => (
                <Box key={index} sx={{ width: '100%', overflow: 'hidden' }}>
                  <img
                    src={image}
                    alt={`Trip Image ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>
              ))
            ) : (
              <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <img
                  src={Nature}
                  alt="Default Image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}
          </Slider>
      :
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <img
        src={trip.images && trip.images.length > 0 ? trip.images[0] : Nature}
        alt="Trip Image"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      </Box>
      }

    </Box> 
    :
    <>
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
    </>    
    }

      <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left' }}>{trip.title}</Typography>
      <Typography variant="body2" sx={{ textAlign: 'left' }}>{trip.description}</Typography>
      <Stack sx={{ alignItems: 'end' }}>
        <LinkHref variant="body2" href={trip.url} target="_blank" rel="noopener noreferrer" >
            {displayUrl}
          <OpenInNew sx={{ ml: 0.5, fontSize: '1rem' }}/>
        </LinkHref>
      </Stack>
      {collectionName && <Typography variant="body2" sx={{ textAlign: 'left' }}>Collection: {collectionName}</Typography>}
      <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Link  to={`/trip/${id}/edit`}><Button variant='outlined'>Edit</Button></Link>
        <Button variant='outlined' onClick={handleDelete}>Delete</Button>
      </Stack>
      </Stack>
    )
}