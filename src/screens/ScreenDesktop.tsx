import { Stack, Box, Button } from '@mui/material';
import TemporaryPanel from '../components/TemporaryPanel';
import MapComponent from '../components/MapComponent';
import MenuBar from '../components/MenuBar';
import { drawerWidth } from '../utils/styling';


interface ScreenDesktopProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  showAreaButton: boolean;
  setShowAreaButton: (showAreaButton: boolean) => void;
  areaSearched: boolean;
  setAreaSearched: (areaSearched: boolean) => void;
  handleAreaButton: () => void;
}

export default function ScreenDesktop({
  children, open, setOpen, showAreaButton, setShowAreaButton, areaSearched, setAreaSearched, handleAreaButton
}: ScreenDesktopProps) {

  
  return (
  <>
  <MenuBar/>

    <Stack direction="row" sx={{ position: 'relative', width: '100%' }}>

    <TemporaryPanel open={open} setOpen={setOpen}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Box sx={{ width: drawerWidth }}>
          {children}
        </Box>
      </Box>
    </TemporaryPanel>

    <Box sx={{
      height: 'calc(100vh - (${headerHeight} + ${menuBarHeight}))',
      width: '100%',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1000, width: open ? `calc(100vw - ${drawerWidth}px)` : '100vw'}}>
        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 2 }}>
          {showAreaButton === false ? null : <Button onClick={handleAreaButton} variant='contained'>Search this area</Button>}
        </Stack>
      </Box>
      <MapComponent areaSearched={areaSearched} setAreaSearched={setAreaSearched} setShowAreaButton={setShowAreaButton} />
    </Box>

    </Stack>
    </>
  );
}