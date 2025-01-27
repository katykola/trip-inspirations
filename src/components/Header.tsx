import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Menu, MenuItem, ListItemIcon, IconButton, Tooltip, Stack, Typography, useMediaQuery } from '@mui/material';
import { Logout, Map } from '@mui/icons-material';
import { headerHeight } from '../utils/styling';
import { smallScreenBreakpoint } from '../utils/breakpoints';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useCollection } from '../context/CollectionContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const isMobile = useMediaQuery(smallScreenBreakpoint);
  const theme = useTheme();
  const { user, logout } = useAuth();
  const userLoggedId = user !== null;

  const { currentLocation, setSearchedLocation } = useLocation();
  const { setTripDetailOpen } = useVisibleTrips();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { setSelectedCollection } = useCollection();
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

  const handleMapPageClick = () => {
    setSelectedCollection(null);
    setTripDetailOpen(false);
    navigate('/map');
  };

  const handleCollectionsPageClick = () => {
    setSelectedCollection(null);
    setTripDetailOpen(false);
    navigate('/collections');
  };

  const handleNewTripClick = () => {
    navigate('/new');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSigninClick = () => {
    navigate('/signup');
  };

  const handleLogOutClick = () => {
    setSearchedLocation(currentLocation || [48.210033, 16.363449]);
    navigate('/');
    logout();
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '';

  return (
    <>
      <Stack
        direction="row"
        sx={{
          height: headerHeight,
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: isMobile ? '1rem' : '2rem',
          backgroundColor: theme.palette.background.default,
          zIndex: 3000,
          position: isMobile ? 'absolute' : 'inherit',
        }}
      >
        <Stack direction="row" spacing={2} alignItems='flex-end'  sx={{ color: 'black', cursor: 'pointer' }}>
          <Stack direction="row" alignItems="center" onClick={userLoggedId ? handleCollectionsPageClick : handleHomePageClick}>
            <Map sx={{ mr: 0.5, color: theme.palette.secondary.main  }} />
            <Typography
              sx={{
                fontFamily: '"Barlow", serif',
                fontWeight: 'bolder',
                fontSize: '1.2rem',
                color: theme.palette.secondary.main,
              }}
            >
              Trip Snap
            </Typography>
          </Stack>
          {userLoggedId && <Typography onClick={handleCollectionsPageClick}>Collections</Typography>}
          {userLoggedId && <Typography onClick={handleMapPageClick}>Map</Typography>}
        </Stack>

        {userLoggedId ? (
          <>
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <Button onClick={handleNewTripClick} variant="contained">
                + New Trip
              </Button>

              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32, backgroundColor: theme.palette.secondary.main
                   }}>
                    <Typography sx={{ fontSize: '1rem' }}>{userInitial}</Typography>
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
              <MenuItem onClick={handleLogOutClick}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontFamily: '"Work Sans", serif', cursor: 'pointer'}} onClick={handleLoginClick}>
              Log In
            </Typography>

            <Button onClick={handleSigninClick} variant="outlined">
              Sign Up
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
}