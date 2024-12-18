import { Stack } from '@mui/material';
import { Trip } from '../types/types';
import TripTile from './TripTile';

interface TripListProps {
  trips: Trip[];
  onTripSelect: (id: string) => void;
}

export default function TripList({ trips, onTripSelect }: TripListProps) {
  return (
    <Stack>
      {trips.map((trip) => (
        <TripTile key={trip.id} id={trip.id} trip={trip} onTripSelect={onTripSelect} />
      ))}
    </Stack>
  );
}