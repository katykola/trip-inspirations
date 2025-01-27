import { useEffect, useRef } from 'react';
import { Stack, Typography, Pagination, Grid, useMediaQuery, Button } from '@mui/material';
import TripTile from './TripTile';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { useLocation } from '../context/LocationContext';
import { smallScreenBreakpoint } from '../utils/breakpoints'
import { useCollection } from '../context/CollectionContext';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {  collection, query, where, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase-config';

export default function TripList() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);
  const navigate = useNavigate();

  const { selectedCollection, setSelectedCollection, collectionName } = useCollection();
  const { visibleTrips, selectedTripId } = useVisibleTrips();
  const { page, setPage } = useLocation();
  const tripsPerPage = 20;

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * tripsPerPage;
  const endIndex = startIndex + tripsPerPage;
  const paginatedTrips = visibleTrips.slice(startIndex, endIndex);
  const tripTileRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [page]);

  useEffect(() => {
    if (tripTileRef.current) {
      tripTileRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTripId]);

  const onBack = () => {
    navigate('/collections');
  };

  const deleteCollection = async (collectionId: string | null) => {
    if (collectionId) {
      try {
        const tripsQuery = query(collection(db, 'trips'), where('collection', '==', collectionId));
        const tripsSnapshot = await getDocs(tripsQuery);
        
        const batch = writeBatch(db);
        tripsSnapshot.forEach((tripDoc) => {
          const tripRef = doc(db, 'trips', tripDoc.id);
          batch.update(tripRef, { collection: null });
          });
        await batch.commit();

        await deleteDoc(doc(db, 'collections', collectionId));
        console.log(`Deleted collection with id: ${collectionId}`);
        setSelectedCollection(null);
        navigate('/collections');
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    }
  };

  const handleDelete = () => {
    if (selectedCollection) {
      deleteCollection(selectedCollection);
      navigate('/collections');
    }
  };
    
  return (
    <Stack ref={topRef} spacing={2} sx={{ px: isMobile ? 0 :'2rem', py: '1rem', position: 'sticky', top: 0 }}>
      {selectedCollection ? 
      <Stack >
        <Stack direction='row' justifyContent='space-between'>
          <Stack onClick={onBack} direction='row' alignItems='center' sx={{ cursor: 'pointer' }}>
            <ChevronLeft sx={{ color: 'grey', mr: 0.5, fontSize: '0.9rem', verticalAlign: 'bottom' }}/>
            <Typography sx={{ color: 'grey', fontSize: '0.9rem' }}>Back to collections</Typography>
          </Stack>
          <Button variant='outlined' onClick={handleDelete}>Delete</Button>
        </Stack>
        <Typography variant='h4'>{collectionName}</Typography>
      </Stack>
      : null }
      {isMobile ? null : 
      <Typography sx={{ color: 'grey', textAlign: 'left' }}>
        {(startIndex+1)} - { visibleTrips.length < endIndex ? visibleTrips.length : endIndex } out of {visibleTrips.length}  Trips</Typography>}
      {isMobile ? 
      <Stack spacing={1}>
      {paginatedTrips.map((trip) => (
        <TripTile 
          ref={trip.id === selectedTripId ? tripTileRef : null} 
          key={trip.id} 
          id={trip.id} 
          trip={trip} 
        />
        ))}
      </Stack>
      :
      <Grid ref={topRef} container>
        {paginatedTrips.map((trip, index) => (
          <Grid item xs={6} sm={6} md={6} key={trip.id} sx={{paddingBottom: '0.5rem', paddingLeft: index % 2 === 1 ? '0.5rem' : 0}}>
            <TripTile 
            ref={trip.id === selectedTripId ? tripTileRef : null} 
            key={trip.id} 
            id={trip.id} 
            trip={trip}
            />
          </Grid>
        ))}
      </Grid>
      }
      <Pagination
        count={Math.ceil(visibleTrips.length / tripsPerPage)}
        page={page}
        onChange={handleChange}
        sx={{ alignSelf: 'center' }}
      />
    </Stack>
  );
}