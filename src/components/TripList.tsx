import { useEffect } from 'react';
import { Stack, Typography, Pagination, Grid } from '@mui/material';
import TripTile from './TripTile';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { useLocation } from '../context/LocationContext';

export default function TripList() {

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

  console.log('page', page)
    
  return (
    <Stack spacing={2} sx={{ px: '2rem', py: '1rem' }}>
      <Typography sx={{ color: 'grey', textAlign: 'left' }}>{(startIndex+1)} - {endIndex} out of {visibleTrips.length} Trips</Typography>
      <Grid container spacing={2}>
        {paginatedTrips.map((trip) => (
          <Grid item xs={12} sm={6} md={6} key={trip.id}>
            <TripTile id={trip.id} trip={trip} />
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(visibleTrips.length / tripsPerPage)}
        page={page}
        onChange={handleChange}
        sx={{ alignSelf: 'center', py: '1rem' }}
      />
    </Stack>
  );
}