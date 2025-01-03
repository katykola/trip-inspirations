import { useMediaQuery } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import ScreenDesktop from '../screens/ScreenDesktop';
import SwipeablePanel from '../components/SwipeablePanel';
import MapComponent from '../components/MapComponent';
import TripList from '../components/TripList';
import MenuBar from '../components/MenuBar';


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
      <MenuBar />
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