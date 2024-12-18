import React, { useState } from 'react';
import { Stack, Typography, RadioGroup, FormControlLabel, Radio, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import TripScraperForm from '../components/TripScraperForm';
import TripNewForm from '../components/TripNewForm';
import { fetchAndParse } from '../utils/scraper';

interface TripNewProps {
  onContinue: () => void;
  onClose: () => void;
}

export default function TripNew({ onContinue, onClose }: TripNewProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [scrapedData, setScrapedData] = useState<{ title: string; description: string; images: string[] } | null>(null);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption((event.target as HTMLInputElement).value);
    console.log('Selected Option:', (event.target as HTMLInputElement).value);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleContinue = async () => {
    console.log('Continue clicked, selectedOption:', selectedOption);
    if (selectedOption === 'loadTripFromURL' && url) {
      const data = await fetchAndParse(url);
      if (data) {
        setScrapedData(data);
        setShowForm(true);
        console.log('Show form set to true with scraped data:', data);
        navigate('/new?tab=save_from_url');
      }
    } else if (selectedOption === 'makeNewTrip') {
      setShowForm(true);
      console.log('Show form set to true');
      navigate('/new?tab=make_new');
    } else {
      onContinue();
    }
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleSubmit = async (data: any, reset: () => void) => {
    console.log('Form submitted:', data);
    try {
      const docRef = await addDoc(collection(db, 'trips'), data);
      console.log('Document written with ID: ', docRef.id);
      reset();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 3, width: '100%' }}>
      {showForm ? (
        selectedOption === 'loadTripFromURL' ? (
          <TripScraperForm onBack={handleBack} onSubmit={handleSubmit} scrapedData={scrapedData} url={url} />
        ) : (
          <TripNewForm onBack={handleBack} onSubmit={handleSubmit} />
        )
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>New Trip</Typography>
          <RadioGroup value={selectedOption} onChange={handleChange}>
            <FormControlLabel
              control={<Radio />}
              label="Load trip from URL"
              value="loadTripFromURL"
              sx={{ color: selectedOption === 'makeNewTrip' ? 'grey.500' : 'inherit' }}
            />
            {selectedOption === 'loadTripFromURL' && (
              <TextField
                label="Link"
                variant="outlined"
                fullWidth
                value={url}
                onChange={handleUrlChange}
                sx={{ mt: 2 }}
              />
            )}
            <FormControlLabel
              control={<Radio />}
              label="Create your own trip"
              value="makeNewTrip"
              sx={{ color: selectedOption === 'loadTripFromURL' ? 'grey.500' : 'inherit' }}
            />
          </RadioGroup>
          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Button onClick={onClose} variant='contained'>Back</Button>
            <Button onClick={handleContinue} variant='contained' disabled={!selectedOption || (selectedOption === 'loadTripFromURL' && !url)}>Continue</Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}