import { useState, useEffect } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, Stack } from '@mui/material/';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useVisibleTrips } from '../context/VisibleTripsContext';

const drawerBleeding = 54;

interface SwipeablePanelProps {
  children: React.ReactNode;
}

const Puller = styled('div')(({ theme }) => ({
  width: 40,
  height: 4,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 10,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));

export default function SwipeablePanel({ children }: SwipeablePanelProps) {

  const { visibleTrips } = useVisibleTrips();

  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(100% - 5rem)`,
            overflow: 'visible',
          },
        }}
      />

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        BackdropProps={{
          style: { backgroundColor: 'transparent' }, // Make the backdrop transparent
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            backgroundColor: 'white',
          }}
        >
          <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Puller sx={{ width: '50px' }}/>
            <Typography sx={{ p: 2, mt: 1,  textAlign: 'center', fontWeight: 'bolder' }}>{visibleTrips.length} Trips</Typography>
          </Stack>
        </Box>

        {/* Drawer content */}
        <Box sx={{ px: '1rem', height: '100%', overflow: 'auto', width: '100%' }}>
          {children}
        </Box>
      </SwipeableDrawer>
    </>
  );
}