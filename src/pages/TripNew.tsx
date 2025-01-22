import { useState } from 'react';
import { Stack, Typography, Button, TextField, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import TripScraperForm from './TripScraperForm';
import { fetchAndParse } from '../utils/scraper';
import { useLocation } from '../context/LocationContext';
import { z } from 'zod';
import { smallScreenBreakpoint } from '../utils/breakpoints'
import { Trip } from '../types/types';


const schema = z.object({
  url: z.string().url('Url invalid. Check if your link contains https://').max(300, 'Description must be less than 2000 characters'),
})

export default function TripNew() {
  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<{ title: string; description: string; images: string[] } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { setSelectedLocation } = useLocation();
  
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);

    try {
      if (newUrl === '') {
        setError(null);
      } else {
        schema.parse({ url: newUrl });
        setError(null);
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0]?.message || 'Invalid input');
      }
    }
  };
 
  const handleContinue = async () => {
    try {

      schema.parse({ url });
      const data = await fetchAndParse(url);
      setError(null);

      if (data && data.images.length > 0) {
        if (data.images && data.images.length > 6) {
          data.images = data.images.slice(0, 6);
        }
        setScrapedData(data);
        setShowForm(true);
        console.log('Scraped data:', data.images);
      } else {
        setError("Sorry can't get images from here. Try another url adress.")
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0]?.message || 'Invalid input');
      } else {
        if (e instanceof Error) {
          setError(e.message || 'Error fetching data. Please check the URL and try again.');
        } else {
          setError('Error fetching data. Please check the URL and try again.');
        }
      }
    }
  };

  const handleSubmit = async (data: Trip, reset: () => void) => {
    console.log('Form submitted:', data);
    console.log('Data lat lng', [data.lat, data.lng]);
    if(data.lat === 0 && data.lng === 0){
      setSelectedLocation([data.lat, data.lng]);
    }
    try {
      const docRef = await addDoc(collection(db, 'trips'), data);
      console.log('Document written with ID: ', docRef.id);
      reset();
      return docRef.id; 
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  console.log('url', url);

  return (
    <Stack spacing={2} sx={{ p: 3, width: '100%', mt: isMobile ? '3rem' : 0  }}>
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
            error={!!error} // Highlight field if there's an error
            helperText={error || ''} // Show error message below the field
          />
          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Link to="/"><Button variant='outlined'>Back</Button></Link>
            <Button onClick={handleContinue} variant='contained' disabled={!url}>Continue</Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}

