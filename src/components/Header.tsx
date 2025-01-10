import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Stack, Typography, useMediaQuery } from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';
import { headerHeight } from '../utils/styling';
import { Map } from '@mui/icons-material';
import { smallScreenBreakpoint } from '../utils/breakpoints';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';


export default function Header() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);
  const { user, logout } = useAuth();
  const userLoggedId = user !== null;

  const {setSearchedLocation} = useLocation();

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

  const handleLoginClick = () => {
    navigate('/login');
  }

  const handleSigninClick = () => {
    navigate('/signup');
  }

  const handleLogOutClick = () => {
    logout();
    // setSearchedLocation([48.210033, 16.363449]);
    navigate('/logout')
    // alert("Logout successful!");
  }

  const handleAlertNew = () => {
    alert("Do you want to add a new trip? Sign up.");
  }

  return (

    <>
      <Stack 
        direction='row'
        sx={{
            height: headerHeight,
            width: '100%',
            justifyContent: "space-between",
            alignItems: "center",
            px: isMobile ? '1rem' : '2rem',
            borderTop: '1px solid lightgrey',
            borderBottom: '1px solid lightgrey',
            backgroundColor: 'grey.50',
            zIndex: 3000,
            position: isMobile ? 'absolute' : 'inherit'
        }}
      >

          <Stack direction='row' alignItems='center' onClick={handleHomePageClick} sx={{color:'black', cursor: 'pointer'}}>
            <Map sx={{ mr: 1 }} />
            <Typography>Trip Snap</Typography>
          </Stack>

          { userLoggedId ? 


          <>
          <Stack direction='row' sx={{alignItems: 'center'}}>

            <Button onClick={handleNewTripClick} variant='contained'>+ New Trip</Button>
            
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                >
              <Avatar sx={{ width: 32, height: 32 }}>
                <Typography sx={{ fontSize: '1rem' }}>K</Typography>
              </Avatar>              
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
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogOutClick}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          </>
          :
          <Stack direction='row' spacing={2} sx={{alignItems: 'center'}}>
            <Button onClick={handleAlertNew} variant='contained'>+ New Trip</Button>
            <Button onClick={handleSigninClick} variant='outlined'>Sign Up</Button>
            <Button onClick={handleLoginClick} variant='outlined'>Log In</Button>
          </Stack>

          }


      </Stack>
    </>
  )
}
