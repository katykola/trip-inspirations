import { Stack, Typography, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import TripTile from './TripTile';
import { useLocation } from '../context/LocationContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';

export default function TripList() {

  const { mapRadius, setMapRadius } = useLocation();
  const { visibleTrips } = useVisibleTrips();

  const handleRadiusChange = (event: SelectChangeEvent<number>) => {
    setMapRadius(Number(event.target.value));
  };

  const handleTripList = () => {
    console.log('handleTripList');
  }
  

  const radius = `${mapRadius / 1000} km`;
  return (
    <Stack>
      <Typography variant="h6">{visibleTrips.length} Trips</Typography>
      <Stack direction='row'>
        <Select
          value={mapRadius}
          onChange={handleRadiusChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value={5000}>5 km</MenuItem>
          <MenuItem value={10000}>10 km</MenuItem>
          <MenuItem value={30000}>30 km</MenuItem>
          <MenuItem value={50000}>50 km</MenuItem>
          <MenuItem value={100000}>100 km</MenuItem>
          <MenuItem value={300000}>300 km</MenuItem>
          <MenuItem value={500000}>500 km</MenuItem>
        </Select>
        <Button onClick={handleTripList} variant='contained'>Set</Button>
      </Stack>
      {visibleTrips.map((trip) => (
        <TripTile key={trip.id} id={trip.id} trip={trip} />
      ))}
    </Stack>
  );
}