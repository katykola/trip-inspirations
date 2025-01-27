import { Stack, Typography, Button } from "@mui/material";

export default function HomePage() {
    return (
        <Stack sx={{  backgroundColor: '#F2EEE8', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Stack spacing={5}  sx={{ maxWidth: '500px', margin: 'auto', py: '2rem', textAlign: 'center' }}>
          <Stack spacing={2}>
            <Typography variant="h2">Create your own chest of trips </Typography>
              <Typography>
                Save tips from travel blogs, organize them in collections and view them on the map.
              </Typography>
          </Stack>
            <Stack sx={{ alignItems: 'center' }}><Button variant="contained"><Typography>Get started. It's FREE</Typography></Button></Stack>
          </Stack>
        </Stack>
    );
}