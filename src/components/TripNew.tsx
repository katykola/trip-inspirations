import React, { useState } from 'react';
import { Typography, Button, Stack, FormControlLabel, RadioGroup, Radio, TextField } from '@mui/material';
import TripNewForm from './TripNewForm';

interface TripNewProps {
  onContinue: () => void;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function TripNew({ onContinue, onClose, onSubmit }: TripNewProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption((event.target as HTMLInputElement).value);
    console.log('Selected Option:', (event.target as HTMLInputElement).value);
  };

  const handleContinue = () => {
    console.log('Continue clicked, selectedOption:', selectedOption);
    if (selectedOption === 'loadTripFromURL' || selectedOption === 'makeNewTrip') {
      setShowForm(true);
      console.log('Show form set to true');
    } else {
      onContinue();
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 3, width: '100%' }}>
      {showForm ? (
        <TripNewForm onBack={onClose} onSubmit={onSubmit} />
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>Nový výlet</Typography>
          <RadioGroup value={selectedOption} onChange={handleChange}>
            <FormControlLabel
              control={<Radio />}
              label="Načíst výlet z URL"
              value="loadTripFromURL"
              sx={{ color: selectedOption === 'makeNewTrip' ? 'grey.500' : 'inherit' }}
            />
              {selectedOption === 'loadTripFromURL' && (
                <TextField
                  label="URL výletu"
                  variant="outlined"
                  fullWidth
                />
              )}
            <FormControlLabel
              control={<Radio />}
              label="Vytvořit svůj vlastní výlet"
              value="makeNewTrip"
              sx={{ color: selectedOption === 'loadTripFromURL' ? 'grey.500' : 'inherit' }}
            />
          </RadioGroup>
          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Button onClick={onClose} variant='contained'>Zpět</Button>
            <Button onClick={handleContinue} variant='contained' disabled={!selectedOption}>Pokračovat</Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}