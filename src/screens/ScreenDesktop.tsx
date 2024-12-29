import { useState } from 'react';
import { Stack, Box } from '@mui/material';
import TemporaryPanel from '../components/TemporaryPanel';
import MapComponent from '../components/MapComponent';
import { Trip } from '../types/types';

const DRAWER_WIDTH = 400;

interface ScreenDesktopProps {
  trips: Trip[];
  children: React.ReactNode;
}

export default function ScreenDesktop({
  trips,
  children
}: ScreenDesktopProps) {
  
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleTogglePanel = (open: boolean) => {
    setIsPanelOpen(open);
  };

  return (
    <Stack direction="row" sx={{ position: 'relative', width: '100%' }}>
      <Stack direction="row" >
        <TemporaryPanel onToggle={handleTogglePanel}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Box sx={{ width: DRAWER_WIDTH }}>
              {children}
            </Box>
          </Box>
        </TemporaryPanel>
      </Stack>
      <MapComponent trips={trips} />
    </Stack>
  );
}