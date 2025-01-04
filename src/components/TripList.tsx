import { Stack, Typography } from '@mui/material';
import TripTile from './TripTile';
import { useVisibleTrips } from '../context/VisibleTripsContext';

export default function TripList() {

  const { visibleTrips } = useVisibleTrips();
    
  return (
    <Stack>
      <Typography sx={{ color: 'grey', textAlign: 'left', pl: '1rem', pt: '1rem' }}>{visibleTrips.length} Trips</Typography>
      {visibleTrips.map((trip) => (
        <TripTile key={trip.id} id={trip.id} trip={trip} />
      ))}
    </Stack>
  );
}