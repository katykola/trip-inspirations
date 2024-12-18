import React, { useState, useEffect } from 'react';
import { Box, Drawer, Stack } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 500;

interface TemporaryPanelProps {
  children: React.ReactNode;
  onToggle: (open: boolean) => void;
}

export default function TemporaryPanel({ children, onToggle }: TemporaryPanelProps) {
  const [open, setOpen] = useState(true);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    onToggle(open);
  }, [open, onToggle]);

  return (
    <Box sx={{ position: 'relative', height: 'calc(100vh-4rem)', display: 'flex', alignItems: 'center' }}>
      <Box
        onClick={toggleDrawer(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '30px',
          height: '50px',
          backgroundColor: 'green',
          cursor: 'pointer',
        }}
      >
        <ChevronRightIcon />
      </Box>

      <Drawer
        variant="persistent"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            position: 'absolute',
            width: drawerWidth,
            transition: 'transform 0.3s ease-in-out',
            transform: open ? 'translateX(0)' : `translateX(-${drawerWidth - 50}px)`,
          },
        }}
      >
        <Stack direction="row">
          {children}
          <Box
            onClick={toggleDrawer(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '30px',
              height: '50px',
              backgroundColor: 'green',
              cursor: 'pointer',
            }}
          >
            <ChevronLeftIcon />
          </Box>
        </Stack>
      </Drawer>
    </Box>
  );
}