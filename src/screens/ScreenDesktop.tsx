import { Stack, Box } from '@mui/material';
import TemporaryPanel from '../components/TemporaryPanel';
import MapComponent from '../components/MapComponent';
import MenuBar from '../components/MenuBar';
import { drawerWidth } from '../config/styling';

interface ScreenDesktopProps {
  children: React.ReactNode;
}

export default function ScreenDesktop({
  children
}: ScreenDesktopProps) {

  return (
  <>
  <MenuBar/>

    <Stack direction="row" sx={{ position: 'relative', width: '100%' }}>

    <TemporaryPanel>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Box sx={{ width: drawerWidth }}>
          {children}
        </Box>
      </Box>
    </TemporaryPanel>

    <MapComponent/>

    </Stack>
    </>
  );
}