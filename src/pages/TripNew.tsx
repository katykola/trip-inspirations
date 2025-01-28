import { useState } from 'react';
import { Stack, Typography, Button, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import TripScraperForm from './TripScraperForm';
import { fetchAndParse } from '../utils/scraper';
import { useLocation } from '../context/LocationContext';
import { z } from 'zod';
// import { smallScreenBreakpoint } from '../utils/breakpoints'
import { Trip } from '../types/types';
import { menuBarHeight } from '../utils/styling';
import BackgroundImage from '../components/BackgroundImage';


const schema = z.object({
  url: z.string()
  .url('Url invalid. Check if your link contains https://')
  .max(300, 'Description must be less than 2000 characters')
  .refine((url) => !url.includes('mapy.cz') && !url.includes('maps.google.com')  && !url.includes('pinterest')  && !url.includes('booking')  && !url.includes('airbnb'), {
    message: "Sorry, I can't catch data from here. TripSnap works only for travel blogs.",
  }),
})

export default function TripNew() {
  // const isMobile = useMediaQuery(smallScreenBreakpoint);

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
    if(data.lat === 0 && data.lng === 0){
      setSelectedLocation([data.lat, data.lng]);
    }
    try {
      const docRef = await addDoc(collection(db, 'trips'), data);
      reset();
      return docRef.id; 
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Stack
    sx={{
      position: "relative",
      minHeight: `calc(100vh - ${menuBarHeight})`,
    }}
  >
      {showForm ? (
        <TripScraperForm onBack={() => setShowForm(false)} onSubmit={handleSubmit} scrapedData={scrapedData} url={url} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: `calc(100vh - ${menuBarHeight})`, }}>
        <BackgroundImage />
          <Stack 
          spacing={3} 
          sx={{ 
              maxWidth: '600px', 
              zIndex: 1, 
              mx: 'auto', 
              backgroundColor: "grey.50",
              p: 4, 
              borderRadius: 2, 
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}>
            <Typography variant="h5" sx={{ textAlign: 'left', mb: 1 }}>Paste the URL adress of the blog post here:</Typography>
            <TextField
              label="Link"
              variant="outlined"
              fullWidth
              value={url}
              onChange={handleUrlChange}
              sx={{ mt: 2 }}
              error={!!error} 
              helperText={error || ''} 
              inputProps={{
                autoComplete: 'off', // Disable autocomplete
              }}
            />
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Link to="/"><Button variant='outlined'>Back</Button></Link>
              <Button onClick={handleContinue} variant='contained' disabled={!url}>Continue</Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

