import React, { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { menuBarHeight, drawerWidth } from '../config/styling'

interface TemporaryPanelProps {
  children: React.ReactNode;
}

export default function TemporaryPanel({ children }: TemporaryPanelProps) {
  
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (

    <>
      <Drawer
        variant="persistent"
        open={open}
        PaperProps={{
          sx: {
            position: 'absolute',
            zIndex: 1000,
            width: drawerWidth,
            transition: 'transform 5s ease-in-out',
            transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
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
            transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
          }}
        >
          <ChevronLeftIcon 
          sx={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          />
      </Box>

    </>
  );
}