import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Stack } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 500;

interface TemporaryPanelProps {
  children: React.ReactNode;
}

export default function TemporaryPanel({ children }: TemporaryPanelProps) {
  const [open, setOpen] = useState(true);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center' }}>

      <Box onClick={toggleDrawer(true)} 
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '30px', 
            height: '50px', 
            backgroundColor: 'green',
            cursor: 'pointer'
            }}>
          <ChevronRightIcon />
        </Box>

      <Drawer
        variant="persistent"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            position: 'absolute', // Ensure the drawer is positioned absolutely
            width: drawerWidth,
            transition: 'transform 0.3s ease-in-out',
            transform: open ? 'translateX(0)' : `translateX(-${drawerWidth - 50}px)`, // Adjust the transform to keep part of the drawer visible
          },
        }}
      >
        <Stack direction='row'>
          {children}
          <Box onClick={toggleDrawer(false)} 
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '30px', 
            height: '50px', 
            backgroundColor: 'green',
            cursor: 'pointer'
            }}>
          <ChevronLeftIcon />
          </Box>
        </Stack>

      </Drawer>

    </Box>
  );
}