import { useEffect, useRef } from 'react';
import { Stack, Typography, Pagination, Grid, useMediaQuery } from '@mui/material';
import TripTile from './TripTile';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { useLocation } from '../context/LocationContext';
import { smallScreenBreakpoint } from '../utils/breakpoints'


export default function TripList() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);

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

    
  return (
    <Stack ref={topRef} spacing={2} sx={{ px: isMobile ? 0 :'2rem', py: '1rem', position: 'sticky', top: 0 }}>
      {isMobile ? null : <Typography sx={{ color: 'grey', textAlign: 'left' }}>{(startIndex+1)} - {endIndex} out of {visibleTrips.length} Trips</Typography>}
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