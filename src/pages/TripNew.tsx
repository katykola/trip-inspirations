import { useState } from 'react';
import { Stack, Typography, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import TripScraperForm from './TripScraperForm';
import { fetchAndParse } from '../utils/scraper';
import { useLocation } from '../context/LocationContext';
import { z } from 'zod';


const schema = z.object({
  url: z.string().url('Url invalid. Check if your link contains https://').max(300, 'Description must be less than 2000 characters'),
})

export default function TripNew() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null); // To display URL validation errors
  const [scrapedData, setScrapedData] = useState<{ title: string; description: string; images: string[] } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { setSelectedLocation } = useLocation();
  
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);

    // Validate the URL and clear the error if the URL is valid or empty
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
        console.log(data.images.length);
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

