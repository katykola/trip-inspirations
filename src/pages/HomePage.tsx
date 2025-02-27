import { Stack, Typography, Button, Box, useMediaQuery  } from "@mui/material";
import add_new from '../images/add_new.webp';
import map_list from '../images/map_list.webp';
import collections from '../images/collections.webp';
import trip_detail from '../images/trip_detail.webp';
import { smallScreenBreakpoint } from "../utils/breakpoints";

export default function HomePage() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);

    return (
        <Stack sx={{ pb: 4, px: isMobile ? '2rem' : 0 }}>
        <Stack sx={{ position: 'relative', pt: 4, pb: isMobile ? 0 : 4, width: '100%', maxWidth: '2400px', margin: 'auto' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '80%', height: '80%', zIndex: 1, backgroundImage: `url(/path2.svg)`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: '90% center' }} />
          <Stack sx={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 4, pb: isMobile ? 0 : 4 }}>
            <Stack spacing={5} sx={{ maxWidth: '500px', margin: 'auto', py: '2rem', textAlign: 'center' }}>
              <Stack spacing={2}>
                <Typography variant="h2">Create your own <b style={{ color: '#FF6F61' }}>chest of trips</b> </Typography>
                <Typography>
                  Save tips from travel blogs, organize them in collections and view them on the map.
                </Typography>
              </Stack>
              <Stack sx={{ alignItems: 'center' }}>
                <Button variant="contained" sx={{ py: 2, px: 3, borderRadius: '20px' }} href="/signup">
                  <Typography>Get started. It's FREE</Typography>
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

          <Stack spacing={4} sx={{ maxWidth: '800px', margin: 'auto', py: '2rem', textAlign: 'center' }}>
            <Stack spacing={2} sx={{  margin: 'auto'}}>
              <Typography variant="h4" sx={{ fontWeight: 'bold'}}>1. Save <b style={{ color: '#FF6F61' }}>Travel</b> Inspiration</Typography>
              <Typography>Easily save destinations, activities, and tips from travel blogs and articles.</Typography>
            </Stack>
            <Box sx={{ width: '100%', margin: 'auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <img
                src={add_new}
                alt="Add New"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Stack>

          <Stack spacing={4} sx={{ maxWidth: '800px', margin: 'auto', py: '2rem', textAlign: 'center' }}>
            <Stack spacing={2} sx={{  margin: 'auto'}}>
              <Typography variant="h4" sx={{ fontWeight: 'bold'}}>2. Interactive <b style={{ color: '#FF6F61' }}>Map</b> </Typography>
              <Typography>Add your saved cards to the map for a clear overview of your plans.</Typography>
            </Stack>
            <Box sx={{ width: '100%', margin: 'auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <img
                src={map_list}
                alt="Add New"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Stack>

          <Stack spacing={4} sx={{ maxWidth: '800px', margin: 'auto', py: '2rem', textAlign: 'center' }}>
            <Stack spacing={2} sx={{  margin: 'auto'}}>
              <Typography variant="h4" sx={{ fontWeight: 'bold'}}>3. Build <b style={{ color: '#FF6F61' }}>Collections</b> </Typography>
              <Typography>Group destinations into trips or thematic collections (like "Wandering in Alps" or "City Life in Vienna").</Typography>
            </Stack>
            <Box sx={{ width: '100%', margin: 'auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <img
                src={collections}
                alt="Add New"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Stack>

          <Stack spacing={4} sx={{ maxWidth: '800px', margin: 'auto', py: '2rem', textAlign: 'center'}}>
            <Stack spacing={2} sx={{  margin: 'auto'}}>
              <Typography variant="h4" sx={{ fontWeight: 'bold'}}>4. Filter and <b style={{ color: '#FF6F61' }}>Explore</b> </Typography>
              <Typography>Narrow down your trips based on location, distance, or type of adventure.</Typography>
            </Stack>
            <Box sx={{ width: '100%', margin: 'auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <img
                src={trip_detail}
                alt="Add New"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Stack>
            


          <Stack spacing={3}>
          <Typography>Ready to plan your next adventure?</Typography>
          <Stack sx={{ alignItems: 'center' }}><Button variant="contained" sx={{py: 2, px: 3, borderRadius: '20px'}} href="/signup"><Typography>Get started.</Typography></Button></Stack>
          </Stack>

        </Stack>
    );
}