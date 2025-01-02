import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import ScreenDesktop from '../screens/ScreenDesktop';
import SwipeablePanel from '../components/SwipeablePanel';
import MapComponent from '../components/MapComponent';
import TripList from '../components/TripList';


export default function HomePage() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);
  
  return (
    <>
    {!isMobile ? (
      <ScreenDesktop >
          <TripList />
      </ScreenDesktop>
     ) : (
      <>
      <MapComponent />
      <SwipeablePanel>
        <TripList />
      </SwipeablePanel>
      </>
      )
    }
    </>
  );
}