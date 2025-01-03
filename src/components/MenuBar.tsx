import { Select, MenuItem, SelectChangeEvent, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import { Search, Adjust } from '@mui/icons-material';
import { useLocation } from '../context/LocationContext';
import { menuBarHeight } from '../config/styling';

export default function MenuBar() {
  const { mapRadius, setMapRadius, currentLocation } = useLocation();

  const handleRadiusChange = (event: SelectChangeEvent<number>) => {
    setMapRadius(Number(event.target.value));
  };

  return (
    <>
      <Stack 
        direction='row' 
        sx={{
          height: menuBarHeight,
          width: '100%', 
          gap: '1rem',
          alignItems: "center", 
          px: '2rem',
          borderBottom: '1px solid grey'
        }}
      >
        <Typography >Search your trips:</Typography>
        <TextField
          value={currentLocation ? 'Current Location' : 'Selected Location'}
          disabled
          sx={{
            maxHeight: '2.5rem', // Restricting height to 2.5rem
            '& .MuiOutlinedInput-root': {
              height: '2.5rem', // Ensures the input field respects the height
            },
            '& .MuiInputAdornment-root': {
              height: '2.5rem', // Aligns the adornment with the input
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
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
          }}          startAdornment={
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
      </Stack>
    </>
  );
}