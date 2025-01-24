import { Box, Drawer } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { menuBarHeight, drawerWidth } from '../utils/styling'
import { useVisibleTrips } from '../context/VisibleTripsContext';

interface TemporaryPanelProps {
  children: React.ReactNode;
}

export default function TemporaryPanel({ children }: TemporaryPanelProps) {

  const { panelOpen, setPanelOpen } = useVisibleTrips();
  
  const toggleDrawer = () => {
    setPanelOpen(!panelOpen);
  };

  return (

    <>
      <Drawer
        variant="persistent"
        open={panelOpen}
        PaperProps={{
          sx: {
            position: 'absolute',
            zIndex: 1000,
            width: drawerWidth,
            backgroundColor: 'white',
            transition: 'transform 5s ease-in-out',
            transform: panelOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
          },
        }}
        >
        {children}
      </Drawer>

      <Box
          onClick={()=>toggleDrawer()}
          sx={{
            position: 'absolute',
            left: drawerWidth,
            top: `calc(50% - ${menuBarHeight})`,
            display: 'flex',
            alignItems: 'center',
            width: '30px',
            height: '50px',
            border: '1px solid darkgrey',
            borderLeft: 'none',
            borderRadius: '0 5px 5px 0',
            backgroundColor: 'grey.200',
            zIndex: 2000,
            cursor: 'pointer',
            transform: panelOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
          }}
        >
          <ChevronRightIcon 
          sx={{
            transform: panelOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          />
      </Box>
      



    </>
  );
}