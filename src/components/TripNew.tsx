import { Typography,  Button, Input, Stack } from '@mui/material';

interface TripNewProps {
    onContinue: () => void;
    onClose: () => void;
}

export default function TripNew({onContinue, onClose}: TripNewProps) {

  return (
    <Stack spacing={3} sx={{p:3, width: '100%'}}>
      <Typography variant="h4" sx={{ mb: 2 }}>Nový výlet</Typography>
      <Typography>Vlož url adresu stránky</Typography>
      <Input/>
      <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant='contained'>Zpět</Button>
          <Button onClick={onContinue} variant='contained'>Pokračovat</Button>
      </Stack>
    </Stack>
  );
}