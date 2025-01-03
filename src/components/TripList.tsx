import { Stack, Typography } from '@mui/material';
import TripTile from './TripTile';
import { useVisibleTrips } from '../context/VisibleTripsContext';

export default function TripList() {

  const { visibleTrips } = useVisibleTrips();
    
  return (
    <Stack>
      <Typography variant="h6">{visibleTrips.length} Trips</Typography>
      {visibleTrips.map((trip) => (
        <TripTile key={trip.id} id={trip.id} trip={trip} />
      ))}
    </Stack>
  );
}