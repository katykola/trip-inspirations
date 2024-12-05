import { Stack } from '@mui/material';
import TemporaryPanel from '../components/TemporaryPanel';
import TripList from '../components/TripList';
import TripDetail from '../components/TripDetail';
import TripNew from '../components/TripNew';
import TripNewForm from '../components/TripNewForm';
import MapComponent from '../components/MapComponent';
import { Trip } from '../types/types';

interface HomeScreenDesktopProps {
    showTripNew: boolean;
    showTripNewForm: boolean;
    selectedTripId: string | null;
    trips: Trip[];
    handleBackToTripNew: () => void;
    handleShowTripNewForm: () => void;
    handleCloseTripNew: () => void;
    handleTripSelect: (id: string) => void;
    handleBackToList: () => void;
}

export default function HomeScreenDesktop({
    showTripNew,
    showTripNewForm,
    selectedTripId,
    trips,
    handleBackToTripNew,
    handleShowTripNewForm,
    handleCloseTripNew,
    handleTripSelect,
    handleBackToList,
  }: HomeScreenDesktopProps) {
    
return (
        <Stack direction='row' sx={{ width: '100%' }}>
        <TemporaryPanel>
          {showTripNew ? (
            showTripNewForm ? (
              <TripNewForm onBack={handleBackToTripNew} />
            ) : (
              <TripNew onContinue={handleShowTripNewForm} onClose={handleCloseTripNew} />
            )
          ) : selectedTripId ? (
            <TripDetail id={selectedTripId} onBack={handleBackToList} />
          ) : (
            <TripList onTripSelect={handleTripSelect} />
          )}
        </TemporaryPanel>
        <MapComponent trips={trips} onTripSelect={handleTripSelect} />
      </Stack>
    )
}