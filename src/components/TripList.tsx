import { useEffect } from 'react';
import { Stack, Typography, Pagination, Grid, useMediaQuery } from '@mui/material';
import TripTile from './TripTile';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { useLocation } from '../context/LocationContext';
import { smallScreenBreakpoint } from '../config/breakpoints'


export default function TripList() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const { visibleTrips } = useVisibleTrips();
  const { page, setPage } = useLocation();
  const tripsPerPage = 20;

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * tripsPerPage;
  const endIndex = startIndex + tripsPerPage;
  const paginatedTrips = visibleTrips.slice(startIndex, endIndex);

  useEffect(()=> {
    setPage(1);
  }, [visibleTrips])
    
  return (
    <Stack spacing={2} sx={{ px: isMobile ? 0 :'2rem', py: '1rem' }}>
      {isMobile ? null : <Typography sx={{ color: 'grey', textAlign: 'left' }}>{(startIndex+1)} - {endIndex} out of {visibleTrips.length} Trips</Typography>}
      {isMobile ? 
      <Stack spacing={1}>
      {paginatedTrips.map((trip) => (
            <TripTile id={trip.id} trip={trip} />
        ))}
      </Stack>
      :
      <Grid container spacing={2} sx={{ ml: -2 }}>
        {paginatedTrips.map((trip) => (
          <Grid item xs={6} sm={6} md={6} key={trip.id}>
            <TripTile id={trip.id} trip={trip} />
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