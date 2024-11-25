import { useState, useEffect } from 'react';
import { CssBaseline, useMediaQuery, Box, Stack } from '@mui/material';
import './App.css';
import Header from './components/Header';
import TemporaryPanel from './components/TemporaryPanel';
import SwipeablePanel from './components/SwipeablePanel';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import MapComponent from './components/MapComponent';
import { db } from './config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

interface Trip {
  id: string;
  title: string;
  link: string;
  lat: number;
  lng: number;
}

function App() {
  const isMobile = useMediaQuery('(max-width:600px)');

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    const getTrips = async () => {
      try {
        const data = await getDocs(collection(db, 'DUMMY_DATA'));
        const filteredData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Trip[];
        setTrips(filteredData);
      } catch (error) {
        console.error('Error getting documents: ', error);  
      }
    };
    getTrips();
  }, []);

  const handleTripSelect = (id: string) => {
    console.log('Selected Trip ID:', id);
    setSelectedTripId(id);
  };

  const handleBackToList = () => {
    setSelectedTripId(null);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flexShrink: 0 }}>
          <Header />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {!isMobile && 
          <Stack direction='row' sx={{ width: '100%' }}>
            <TemporaryPanel>
              {selectedTripId ? (
                <TripDetail id={selectedTripId} onBack={handleBackToList} />
              ) : (
                <TripList onTripSelect={handleTripSelect} />
              )}
            </TemporaryPanel>
            <MapComponent trips={trips} onTripSelect={handleTripSelect} />
          </Stack>
          }

          {isMobile &&  
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
          }
        </Box>
      </Box>
    </>
  );
}

export default App;