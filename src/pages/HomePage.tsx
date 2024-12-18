import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import { CssBaseline, useMediaQuery, Box } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import { Trip } from '../types/types';
import HomeScreenDesktop from '../screens/HomeScreenDesktop';
import HomeScreenMobile from '../screens/HomeScreenMobile';
import TripNew from './TripNew';
import TripDetailPage from './TripDetailPage';

interface HomePageProps {
  trips: Trip[];
}

export default function HomePage({ trips }: HomePageProps) {
  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showTripNew, setShowTripNew] = useState<boolean>(false);
  const [showTripNewForm, setShowTripNewForm] = useState<boolean>(false);

  const handleTripSelect = (id: string) => {
    console.log('Selected Trip ID:', id);
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
              element={<TripNew onContinue={handleShowTripNewForm} onClose={handleBackToTripNew} />}
            />
            <Route
              path="/trips/:id"
              element={<TripDetailPage />
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}