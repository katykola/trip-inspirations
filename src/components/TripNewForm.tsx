import { Typography,  Button, Stack } from '@mui/material';

interface TripNewFormProps {
    onBack: () => void;
}

export default function TripNewForm({ onBack}: TripNewFormProps) {
  return (
    <Stack spacing={3} sx={{p:3, width: '100%'}}>
      <Typography variant="h4" sx={{ mb: 2 }}>Nový výlet</Typography>
      <Typography>Tady bude form.</Typography>
      <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Button onClick={onBack} variant='contained'>Zpět</Button>
          <Button variant='contained'>Uložit</Button>
      </Stack>
    </Stack>
  );
}