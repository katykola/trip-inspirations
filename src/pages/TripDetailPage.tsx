import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../utils/breakpoints';
import { useTrip } from '../hooks/useTrip';
import TripDetail from '../components/TripDetail';
import ScreenDesktop from '../screens/ScreenDesktop';
import { useVisibleTrips } from '../context/VisibleTripsContext';


export default function TripDetailPage() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);
  
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading: loading } = useTrip(id!);
  const { setTripDetailOpen } = useVisibleTrips();

  useEffect(() => {
    setTripDetailOpen(true);
  }, [setTripDetailOpen]);

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
        <ScreenDesktop  >
          <TripDetail id={id} />
        </ScreenDesktop>
      ) : (
        <>
        <Box>
        <TripDetail id={id} />
        </Box>
        </>
      )}
    </>
  );
}