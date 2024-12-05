import { useState } from 'react';
import Header from '../components/Header';
import { CssBaseline, useMediaQuery, Box } from '@mui/material';
import { smallScreenBreakpoint } from '../config/breakpoints';
import { Trip } from '../types/types';
import HomeScreenDesktop from './HomeScreenDesktop';
import HomeScreenMobile from './HomeScreenMobile';

interface MainScreenProps {
    trips: Trip[];
}

export default function MainScreen({trips}: MainScreenProps) {

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
    
      const handleShowTripNew = () => {
        setShowTripNew(true);
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
        <>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ flexShrink: 0 }}>
           <Header onShowTripNew={handleShowTripNew} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            
          {!isMobile && 
          <HomeScreenDesktop 
                showTripNew={showTripNew}
                showTripNewForm={showTripNewForm}
                selectedTripId={selectedTripId}
                trips={trips}
                handleBackToTripNew={handleBackToTripNew}
                handleShowTripNewForm={handleShowTripNewForm}
                handleCloseTripNew={handleCloseTripNew}
                handleTripSelect={handleTripSelect}
                handleBackToList={handleBackToList}
          />}
  
            {isMobile &&  <HomeScreenMobile 
                trips={trips}
                selectedTripId={selectedTripId}
                handleTripSelect={handleTripSelect}
                handleBackToList={handleBackToList}
            />}

          </Box>
        </Box>
        </>
    )
}