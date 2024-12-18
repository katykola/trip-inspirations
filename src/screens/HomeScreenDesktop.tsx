import { useState } from 'react';
import { Stack, Box } from '@mui/material';
import TemporaryPanel from '../components/TemporaryPanel';
import TripList from '../components/TripList';
import TripDetail from '../components/TripDetail';
import TripNew from '../pages/TripNew';
import MapComponent from '../components/MapComponent';
import { Trip } from '../types/types';

const DRAWER_WIDTH = 400;

interface HomeScreenDesktopProps {
  trips: Trip[];
  showTripNew: boolean;
  showTripNewForm: boolean;
  selectedTripId: string | null;
  handleBackToTripNew: () => void;
  handleShowTripNewForm: () => void;
  handleCloseTripNew: () => void;
  handleTripSelect: (id: string) => void;
  handleBackToList: () => void;
}

export default function HomeScreenDesktop({
  trips,
  showTripNew,
  selectedTripId,
  handleShowTripNewForm,
  handleCloseTripNew,
  handleTripSelect,
  handleBackToList,
}: HomeScreenDesktopProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleTogglePanel = (open: boolean) => {
    setIsPanelOpen(open);
    console.log('Panel open:', open);
  };

  const renderTripNew = showTripNew && (
    <TripNew onContinue={handleShowTripNewForm} onClose={handleCloseTripNew} />
  );

  const renderTripDetail = selectedTripId && (
    <TripDetail trips={trips} id={selectedTripId} onBack={handleBackToList} />
  );

  return (
    <Stack direction="row" sx={{ position: 'relative', width: '100%' }}>
      {showTripNew ? (
        renderTripNew
      ) : (
        <>
          <Stack direction="row" >
            <TemporaryPanel onToggle={handleTogglePanel}>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Box sx={{ width: DRAWER_WIDTH }}>
                  {selectedTripId ? (
                    renderTripDetail
                  ) : (
                    <TripList trips={trips} onTripSelect={handleTripSelect} />
                  )}
                </Box>
              </Box>
            </TemporaryPanel>
          </Stack>
          <MapComponent trips={trips} onTripSelect={handleTripSelect} selectedTripId={selectedTripId}/>
        </>
      )}
    </Stack>
  );
}