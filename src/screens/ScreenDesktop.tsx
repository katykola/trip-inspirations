import { Stack, Box } from '@mui/material';
import TemporaryPanel from '../components/TemporaryPanel';
import MapComponent from '../components/MapComponent';
import MenuBar from '../components/MenuBar';

const DRAWER_WIDTH = 350;

interface ScreenDesktopProps {
  children: React.ReactNode;
}

export default function ScreenDesktop({
  children,
}: ScreenDesktopProps) {

 const isPanelOpen = true;

  return (
    <>
    <MenuBar/>
    <Stack direction="row" sx={{ position: 'relative', width: '100%' }}>
      <Stack direction="row" >
        <TemporaryPanel onToggle={()=>!isPanelOpen}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Box sx={{ width: DRAWER_WIDTH }}>
              {children}
            </Box>
          </Box>
        </TemporaryPanel>
      </Stack>
      <MapComponent/>
    </Stack>
    </>
  );
}