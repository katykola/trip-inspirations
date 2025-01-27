import { Stack, Box, Button } from '@mui/material';
import MapComponent from '../components/MapComponent';
import MenuBar from '../components/MenuBar';
import { drawerWidth } from '../utils/styling';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { headerHeight, menuBarHeight } from '../utils/styling';
import { useCollection } from '../context/CollectionContext';
import MapCollection from '../components/MapCollection';


interface ScreenDesktopProps {
  children: React.ReactNode;
}

export default function ScreenDesktop({
  children
}: ScreenDesktopProps) {

  const { showAreaButton, setShowAreaButton, areaSearched, setAreaSearched } = useVisibleTrips();
  const {selectedCollection} = useCollection();

  const handleAreaButton = () => {
    setAreaSearched(true);
    setShowAreaButton(false);
  };


  return (
  <>
  <MenuBar/>

    <Stack direction="row" sx={{ position: 'relative', width: '100%' }}>

    <Box sx={{ height: `calc(100vh - (${headerHeight} + ${menuBarHeight}))`}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
        <Box sx={{ width: drawerWidth, height: '100%', overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>

    <Box sx={{
      height: 'calc(100vh - (${headerHeight} + ${menuBarHeight}))',
      width: '100%',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1000, width: `calc(100vw - ${drawerWidth}px)`}}>
        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 2 }}>
          {showAreaButton === false ? null : <Button onClick={handleAreaButton} variant='contained'>Search this area</Button>}
        </Stack>
      </Box>
      {selectedCollection ? <><MapCollection collectionId={selectedCollection}/></> : <MapComponent areaSearched={areaSearched} setAreaSearched={setAreaSearched} setShowAreaButton={setShowAreaButton} />}

    </Box>

    </Stack>
    </>
  );
}    