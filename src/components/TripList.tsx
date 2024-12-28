import { Stack } from '@mui/material';
import { Trip } from '../types/types';
import TripTile from './TripTile';

interface TripListProps {
  trips: Trip[];
}

export default function TripList({ trips }: TripListProps) {
  return (
    <Stack>
      {trips.map((trip) => (
        <TripTile key={trip.id} id={trip.id} trip={trip} />
      ))}
    </Stack>
  );
}