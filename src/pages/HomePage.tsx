import { Trip } from '../types/types';
import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import ScreenDesktop from '../screens/ScreenDesktop';
import SwipeablePanel from '../components/SwipeablePanel';
import MapComponent from '../components/MapComponent';
import TripList from '../components/TripList';

interface HomePageProps {
  trips:Trip[];
  selectedTripId: string | null;
  handleTripSelect: (id: string) => void;
}

export default function HomePage({ 
  trips, 
  selectedTripId, 
}: HomePageProps) {

  const isMobile = useMediaQuery(smallScreenBreakpoint);
  
  return (
    <>
    {!isMobile ? (
      <ScreenDesktop trips={trips}>
          <TripList trips={trips}/>
      </ScreenDesktop>
     ) : (
      <>
      <MapComponent trips={trips} selectedTripId={selectedTripId}/>
      <SwipeablePanel>
        <TripList trips={trips}/>
      </SwipeablePanel>
      </>
      )
    }
    </>
  );
}