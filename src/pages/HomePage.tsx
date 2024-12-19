import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import { CssBaseline, useMediaQuery, Box } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Trip } from '../types/types';
import HomeScreenDesktop from '../screens/HomeScreenDesktop';
import HomeScreenMobile from '../screens/HomeScreenMobile';
import TripNew from './TripNew';
import TripDetailPage from './TripDetailPage';
import TripEditForm from '../components/TripEditForm';

interface HomePageProps {
  trips: Trip[];
}

export default function HomePage({ trips }: HomePageProps) {
  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showTripNew, setShowTripNew] = useState<boolean>(false);
  const [showTripNewForm, setShowTripNewForm] = useState<boolean>(false);

  const handleTripSelect = (id: string) => {
    setSelectedTripId(id);
  };

  const handleBackToList = () => {
    setSelectedTripId(null);
  };

  const handleCloseTripNew = () => {
    setShowTripNew(false);
  };

  const handleShowTripNewForm = () => {
    setShowTripNewForm(true);
  };

  const handleBackToTripNew = () => {
    setShowTripNewForm(false);
  };

  const handleSubmit = async (data: any, reset: () => void) => {
    console.log('Form submitted:', data);
    try {
      const docRef = await addDoc(collection(db, 'trips'), data);
      console.log('Document written with ID: ', docRef.id);
      reset();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flexShrink: 0 }}>
          <Header />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                !isMobile ? (
                  <HomeScreenDesktop
                    trips={trips}
                    showTripNew={showTripNew}
                    showTripNewForm={showTripNewForm}
                    selectedTripId={selectedTripId}
                    handleBackToTripNew={handleBackToTripNew}
                    handleShowTripNewForm={handleShowTripNewForm}
                    handleCloseTripNew={handleCloseTripNew}
                    handleTripSelect={handleTripSelect}
                    handleBackToList={handleBackToList}
                  />
                ) : (
                  <HomeScreenMobile
                    trips={trips}
                    selectedTripId={selectedTripId}
                    handleTripSelect={handleTripSelect}
                    handleBackToList={handleBackToList}
                  />
                )
              }
            />
            <Route
              path="/new"
              element={<TripNew onContinue={handleShowTripNewForm}  />}
            />
            <Route
              path="/trip/:id"
              element={<TripDetailPage />
              }
            />
            <Route
              path="/trip/:id/edit"
              element={<TripEditForm onSubmit={handleSubmit}/>}
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}