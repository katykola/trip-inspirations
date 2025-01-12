import React, { useState } from 'react';
import { Stack, Typography, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import TripScraperForm from './TripScraperForm';
import { fetchAndParse } from '../utils/scraper';
import { useLocation } from '../context/LocationContext';
import { z } from 'zod';

// Define the Zod schema for form validation
const schema = z.object({
  url: z.string().url('Invalid URL'),
});

export default function TripNew() {
  const [url, setUrl] = useState('');
  const [scrapedData, setScrapedData] = useState<{ title: string; description: string; images: string[] } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { setSelectedLocation } = useLocation();

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleContinue = async () => {
    if (url) {
      const data = await fetchAndParse(url);
      if (data) {
        if(data.images && data.images.length > 6) {
          data.images = data.images.slice(0, 6);
        }
      setScrapedData(data);
      setShowForm(true);
      console.log('Scraped data:', data);
      }
    }
  };

  const handleSubmit = async (data: any, reset: () => void) => {
    console.log('Form submitted:', data);
    console.log('Data lat lng', [data.lat, data.lng]);
    setSelectedLocation([data.lat, data.lng]);
    try {
      const docRef = await addDoc(collection(db, 'trips'), data);
      console.log('Document written with ID: ', docRef.id);
      reset();
      return docRef.id; // Return the new trip ID
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Stack spacing={2} sx={{ p: 3, width: '100%' }}>
      {showForm ? (
        <TripScraperForm onBack={() => setShowForm(false)} onSubmit={handleSubmit} scrapedData={scrapedData} url={url} />
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>New Trip</Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'left', mb: 1 }}>Load trip from URL:</Typography>
          <TextField
            label="Link"
            variant="outlined"
            fullWidth
            value={url}
            onChange={handleUrlChange}
            sx={{ mt: 2 }}
          />
          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Link to="/"><Button variant='contained'>Back</Button></Link>
            <Button onClick={handleContinue} variant='contained' disabled={!url}>Continue</Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}

