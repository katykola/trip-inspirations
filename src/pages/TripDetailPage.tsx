import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, CircularProgress, Button, Link } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import MapComponent from '../components/MapComponent';
import { useTrip } from '../hooks/useTrip';
import Nature from '../images/nature.jpg';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isMobile = useMediaQuery(smallScreenBreakpoint);
  const { data: trip, isLoading: loading } = useTrip(id!);

  if (!id) {
    return <div>Trip ID not found in URL.</div>;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Trip not found.
        </Typography>
        <Button onClick={() => window.history.back()} variant="contained" sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <>
      {!isMobile ? (
        <Stack direction='row'>
          <Stack sx={{ width: '50%', p: 3 }} spacing={2}>
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
              <img
                src={trip.images && trip.images.length > 0 ? trip.images[0] : Nature}
                alt="Trip Image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Stack direction='row' spacing={1}>
              {trip.images && trip.images.length > 0 ? (
                trip.images.slice(1).map((image, index) => (
                  <Box key={index} sx={{ width: '100%', overflow: 'hidden' }}>
                    <img
                      src={image}
                      alt={`Trip Image ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))
              ) : null}
            </Stack>
            <Typography variant="body1">{trip.title}</Typography>
            <Typography variant="body2">{trip.description}</Typography>
            <Link href={trip.url}>{trip.url}</Link>
          </Stack>
          <MapComponent tripId={id} />
        </Stack>
      ) : (
        <Box>
          <h1>Trip Detail Page</h1>
          <p>Selected Trip ID: {id}</p>
        </Box>
      )}
    </>
  );
}