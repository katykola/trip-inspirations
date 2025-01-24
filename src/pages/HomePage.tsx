import { Stack, Typography, Button } from "@mui/material";

export default function HomePage() {
    return (
        <Stack sx={{  backgroundColor: '#F2EEE8', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Stack sx={{ maxWidth: '500px', margin: 'auto', py: '2rem', textAlign: 'center' }}>
          <Typography variant="h2">Create your own chest of trips </Typography>
            <Typography>
              Save the tips from travel blogs on the map and create collections to plan your holidays.
            </Typography>
            <Stack sx={{ alignItems: 'center' }}><Button variant="contained">Get started. It's FREE</Button></Stack>
          </Stack>
        </Stack>
    );
}