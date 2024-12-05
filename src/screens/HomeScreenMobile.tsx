import TripDetail from '../components/TripDetail';
import TripList from '../components/TripList';
import MapComponent from '../components/MapComponent';
import SwipeablePanel from '../components/SwipeablePanel';
import { Trip } from '../types/types';

interface HomeScreenMobileProps {
    trips: Trip[];
    selectedTripId: string | null;
    handleTripSelect: (id: string) => void;
    handleBackToList: () => void;
}

export default function HomeScreenMobile({
    trips,
    selectedTripId,
    handleTripSelect,
    handleBackToList}: HomeScreenMobileProps) {
        
    return (
        <>
        <MapComponent trips={trips} onTripSelect={handleTripSelect} />
        <SwipeablePanel>
          {selectedTripId ? (
            <TripDetail id={selectedTripId} onBack={handleBackToList} />
          ) : (
            <TripList onTripSelect={handleTripSelect} />
          )}
        </SwipeablePanel>
      </>
    )
}