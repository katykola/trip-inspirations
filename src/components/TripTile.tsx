import { Box, Typography, Link } from '@mui/material';
import { Trip } from '../types/types';
import Nature from '../images/nature.jpg';

interface TripTileProps {
  id: string;
  trip: Trip;
  onTripSelect: (id: string) => void;
}


export default function TripTile({ id, trip, onTripSelect }: TripTileProps) {

  const handleClick = () => {
    onTripSelect(id);
  };

    return(
        <Box onClick={handleClick} sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', maxWidth: '400px', margin: '16px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Box sx={{ height: '150px', overflow: 'hidden' }}>
          <img
            src={trip.images && trip.images.length > 0 ? trip.images[0] : Nature}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ padding: '16px', textAlign:'left' }}>
          <Typography  variant="body1">{trip.title}</Typography>
          <Typography variant="body2">
          <Link href="https://weinwien.com" target="_blank" rel="noopener noreferrer">
            {trip.url}
          </Link>
          </Typography>
        </Box>
      </Box>
    )
}