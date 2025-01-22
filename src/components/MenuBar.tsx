import React, { useState } from 'react';
import { Select, MenuItem, SelectChangeEvent, Stack, Box, TextField, Typography, InputAdornment, List, ListItem, ListItemButton, ListItemText, IconButton, useMediaQuery} from '@mui/material';
import { Search, Adjust, Close } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { menuBarHeight } from '../utils/styling';
import { smallScreenBreakpoint } from '../utils/breakpoints'

interface Suggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export default function MenuBar() {

  const { user } = useAuth();
  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const { mapRadius, setMapRadius, currentLocation, setSearchedLocation } = useLocation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searched, setSearched] = useState(false);
  const isLoggedIn = user !== null;

  
  const handleRadiusChange = (event: SelectChangeEvent<number>) => {
    setMapRadius(Number(event.target.value));
  };
  
  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (location: { lat: string; lon: string; display_name: string }) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    setSearchedLocation([lat, lon]);
    setQuery(location.display_name);
    setShowSuggestions(false);
  };
  
  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSearched(true);
  };
  
  const { filter, setFilter } = useVisibleTrips();

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const filter = event.target.value;
    setFilter(filter);
  };
  
  return (
    <>
      <Stack 
        direction='row' 
        sx={{
          position: isMobile ? 'absolute' : 'inherit',
          top: '3rem',
          height: menuBarHeight,
          width: '100%', 
          gap: isMobile ? '0.5rem' : '1rem',
          display: "flex",
          justifyContent:'start',
          alignItems: "center", 
          px: isMobile ? '1rem' : '2rem',
          borderBottom: isMobile ? null : '1px solid grey',
          zIndex: isMobile ? 4000 : 'inherit'
        }}
      >

      {isMobile ? 
      null 
      : 
      <>
      <Typography >Search your trips:</Typography>
        <Box sx={{ flexGrow: 1, maxWidth: '40rem'}}>
          <Box sx={{ position: 'relative' }}>
          <TextField
            placeholder="Current Location"
            value={query}
            onChange={handleSearchChange}
            sx={{
              width: '100%',
              maxHeight: '2.5rem',
              '& .MuiOutlinedInput-root': {
                height: '2.5rem',
              },
              '& .MuiInputAdornment-root': {
                height: '2.5rem',
              },
              backgroundColor: 'grey.200',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {showSuggestions && (
            <List
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                zIndex: 1001,
                border: '1px solid lightgray',
                borderRadius: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              {suggestions.map((suggestion: Suggestion) => (
                <ListItem key={suggestion.place_id} disablePadding>
                  <ListItemButton onClick={() => handleSuggestionClick(suggestion)}>
                    <ListItemText primary={suggestion.display_name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
          {!showSuggestions && searched && (
            <List
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                zIndex: 1001,
                border: '1px solid lightgray',
                borderRadius: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setShowSuggestions(false); setSearched(false); if (currentLocation) setSearchedLocation(currentLocation) }}>
                  <ListItemText primary="Current Location" />
                </ListItemButton>
              </ListItem>
             </List>
            )}
            {!showSuggestions && !searched && (
              <></>
            )}
          </Box>
        </Box>
      </>
      }

      <Select
          value={mapRadius}
          onChange={handleRadiusChange}
          sx={{
            flex: '0 1 auto',
            maxWidth: 'max-content',
            backgroundColor: 'white',
            maxHeight: '2.5rem', // Restricting height to 3rem
            overflow: 'hidden', // Ensures no content spills out
            '& .MuiSelect-select': {
              lineHeight: '3rem', // Ensures proper alignment within the height limit
            },
          }}          
          startAdornment={
            <InputAdornment position="start">
              <Adjust />
            </InputAdornment>
            }
        >
          <MenuItem value={5000}>5 km radius</MenuItem>
          <MenuItem value={10000}>10 km radius</MenuItem>
          <MenuItem value={30000}>30 km radius</MenuItem>
          <MenuItem value={50000}>50 km radius</MenuItem>
          <MenuItem value={100000}>100 km radius</MenuItem>
          <MenuItem value={300000}>300 km radius</MenuItem>
          <MenuItem value={500000}>500 km radius</MenuItem>
      </Select>

      { isLoggedIn ? 
        <Select
          value={filter}
          onChange={handleFilterChange}
          sx={{
            flex: '0 1 auto',
            maxWidth: 'max-content',
            backgroundColor: 'white',
            maxHeight: '2.5rem', // Restricting height to 3rem
            overflow: 'hidden', // Ensures no content spills out
            '& .MuiSelect-select': {
              lineHeight: '3rem', // Ensures proper alignment within the height limit
            },
          }} 
        >
          <MenuItem value={'private'}>Private</MenuItem>
          <MenuItem value={'public'}>Public</MenuItem>
          <MenuItem value={'all'}>All trips</MenuItem>
        </Select>
        : 
        null
      }


      </Stack>
    </>
  );
}