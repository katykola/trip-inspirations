import { useNavigate } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import { Trip } from '../types/types';
import Nature from '../images/nature.jpg';

interface TripTileProps {
  id: string;
  trip: Trip;
}

export default function TripTile({ id, trip }: TripTileProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/trip/${id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '400px',
        margin: '16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        flexDirection: { xs: 'column', sm: 'row' }, // Responsive layout
      }}
    >
      <Box
        sx={{
          flex: { xs: '0 0 100%', sm: '0 0 40%' },
          height: { xs: '200px', sm: '150px' },
          overflow: 'hidden',
        }}
      >
        <img
          src={trip.images && trip.images.length > 0 ? trip.images[0] : Nature}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Box
        sx={{
          padding: '16px',
          textAlign: 'left',
          flex: { xs: '0 0 100%', sm: '1' },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Typography variant="body1">{trip.title}</Typography>
        <Typography variant="body2">
          <Link href={trip.url} target="_blank" rel="noopener noreferrer">
            {trip.url}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}