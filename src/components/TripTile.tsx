import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
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
        position: 'relative',
        borderRadius: '5px',
        overflow: 'hidden',
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 0 5px 0 rgba(0,0,0,0.6)',
        },
      }}
    >
      <Box
        sx={{
          height: { xs: '150px', sm: '220px' },
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
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          px: '1rem',
          py: '0.5rem',
          textAlign: 'left',
          backgroundColor: 'black',
          opacity: '0.6'
        }}
      >
        <Typography sx={{ color: 'white', fontSize: '0.9rem'}}>
          { trip.title.length > 55 ? `${trip.title.substring(0, 55)}...` : trip.title}
        </Typography>
      </Box>
      
    </Box>
  );
}