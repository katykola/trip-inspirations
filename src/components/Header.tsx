import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Stack, Typography } from '@mui/material';
import { PersonAdd, Settings, Logout } from '@mui/icons-material';
import { headerHeight } from '../config/styling';


export default function Header() {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHomePageClick = () => {
    navigate('/');
  };

  const handleNewTripClick = () => {
    navigate('/new');
  };


  return (
    <>

      <Stack 
        direction='row'
        sx={{
            height: headerHeight,
            width: '100%',
            justifyContent: "space-between",
            alignItems: "center",
            px: '2rem',
            backgroundColor: '#222222'
        }}
      >

        <Typography onClick={handleHomePageClick} sx={{color:'white', cursor: 'pointer'}}>Trip Snap</Typography>

          <Stack direction='row' sx={{gap: '1rem', alignItems: 'center'}}>

            <Button onClick={handleNewTripClick} variant='contained'>+New Trip</Button>
            
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                >
                <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
              </IconButton>
            </Tooltip>

          </Stack>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
      </Stack>
    </>
  );
}
