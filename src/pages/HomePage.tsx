import { Trip } from '../types/types';
import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import HomeScreenDesktop from '../screens/HomeScreenDesktop';
import SwipeablePanel from '../components/SwipeablePanel';
import MapComponent from '../components/MapComponent';
import TripList from '../components/TripList';

interface HomePageProps {
  trips:Trip[];
  showTripNew: boolean;
  showTripNewForm: boolean;
  selectedTripId: string | null;
  handleBackToTripNew: () => void;
  handleShowTripNewForm: () => void;
  handleCloseTripNew: () => void;
  handleTripSelect: (id: string) => void;
  handleBackToList: () => void;
}

export default function HomePage({ 
  trips, 
  selectedTripId, 
  handleTripSelect,
}: HomePageProps) {

  const isMobile = useMediaQuery(smallScreenBreakpoint);
  
  return (
    <>
    {!isMobile ? (
      <HomeScreenDesktop
        trips={trips}
        handleTripSelect={handleTripSelect}
      />
     ) : (
      <>
      <MapComponent trips={trips} onTripSelect={handleTripSelect} selectedTripId={selectedTripId}/>
      <SwipeablePanel>
          <TripList trips={trips}/>
      </SwipeablePanel>
      </>
      )
    }
    </>
  );
}