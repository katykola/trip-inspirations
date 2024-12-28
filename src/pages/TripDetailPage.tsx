import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, CircularProgress, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import MapComponent from '../components/MapComponent';
import { useTrip } from '../hooks/useTrip';
import TripDetail from '../components/TripDetail';


export default function TripDetailPage() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);
  
  const { id } = useParams<{ id: string }>();
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
          <TripDetail id={id} />
          <MapComponent tripId={id} selectedTripId={id}/>
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