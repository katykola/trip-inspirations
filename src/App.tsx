import { CssBaseline, useMediaQuery, Box, Stack } from '@mui/material';
import './App.css';
import Header from './components/Header'
import TemporaryPanel from './components/TemporaryPanel';
import SwipeablePanel from './components/SwipeablePanel';
import TripList from './components/TripList';
import MapComponent from './components/MapComponent';

function App() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flexShrink: 0 }}>
          <Header />
        </Box>
          <Box sx={{ flexGrow: 1 }}>
          {!isMobile && 
          <Stack direction='row'sx={{width: '100%'}}>
            <TemporaryPanel>
              <TripList/>
            </TemporaryPanel>
            <MapComponent />
          </Stack>
          }
          {isMobile &&  
          <>
          <MapComponent />
          <SwipeablePanel>
            <TripList/>
          </SwipeablePanel>
          </>
          }
          </Box>
  
      </Box>
    </>
  );
}

export default App;