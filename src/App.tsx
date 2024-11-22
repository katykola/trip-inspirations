import { CssBaseline, useMediaQuery, List, ListItem, ListItemText, Box, Stack } from '@mui/material';
import './App.css';
import Header from './components/Header'
import TemporaryPanel from './components/TemporaryPanel';
import SwipeablePanel from './components/SwipeablePanel';

function App() {
  const isMobile = useMediaQuery('(max-width:600px)');

  const drawerContent = (
    <List>
      <ListItem >
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem >
        <ListItemText primary="About" />
      </ListItem>
      {/* Add more list items as needed */}
    </List>
  );

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flexShrink: 0 }}>
          <Header />
        </Box>
        <Box sx={{ flexGrow: 1, backgroundColor: 'mistyrose' }}>
          {!isMobile && <TemporaryPanel />}
          {isMobile && <SwipeablePanel />}
        </Box>
      </Box>
    </>
  );
}

export default App;