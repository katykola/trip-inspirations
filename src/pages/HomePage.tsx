import { useState } from 'react';
import { useMediaQuery, Box, Stack, Button } from '@mui/material';
import { smallScreenBreakpoint } from '../utils/breakpoints';
import ScreenDesktop from '../screens/ScreenDesktop';
import SwipeablePanel from '../components/SwipeablePanel';
import MapComponent from '../components/MapComponent';
import TripList from '../components/TripList';
import MenuBar from '../components/MenuBar';
import { useVisibleTrips } from '../context/VisibleTripsContext';


export default function HomePage() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const [showAreaButton, setShowAreaButton] = useState(false);
  const [areaSearched, setAreaSearched] = useState(false);
  const { setPanelOpen } = useVisibleTrips();
  
  const handleAreaButton = () => {
    setAreaSearched(true);
    setShowAreaButton(false);
    setPanelOpen(true);
  };
  
  return (
    <>
    {!isMobile ? (
      <ScreenDesktop showAreaButton={showAreaButton} setShowAreaButton={setShowAreaButton} areaSearched={areaSearched} setAreaSearched={setAreaSearched} handleAreaButton={handleAreaButton}>
          <TripList />
      </ScreenDesktop>
     ) : (
      <>
      <MenuBar />
      <Box sx={{ position: 'absolute', top: '6rem', right: 0, zIndex: 4000, width: '100vw'}}>
        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 2 }}>
          {showAreaButton === false ? null : <Button onClick={handleAreaButton} variant='contained'>Search this area</Button>}
        </Stack>
      </Box>
      <MapComponent areaSearched={areaSearched} setAreaSearched={setAreaSearched} setShowAreaButton={setShowAreaButton}/>
      <SwipeablePanel>
        <TripList />
      </SwipeablePanel>
      </>
      )
    }
    </>
  );
}