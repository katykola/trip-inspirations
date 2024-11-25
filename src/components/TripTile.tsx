import { Box, Typography, Link } from '@mui/material';

interface TripTileProps {
  id: string;
  title: string;
  link: string;
  onTripSelect: (id: string) => void;
}


export default function TripTile({ id, title, link, onTripSelect }: TripTileProps) {

  const handleClick = () => {
    onTripSelect(id);
  };

    return(
        <Box onClick={handleClick} sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', maxWidth: '400px', margin: '16px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Box sx={{ height: '150px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1659282130892-7538aa7f804d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxhbHBzfGVufDB8MHwwfHx8Mg%3D%3D"
            alt="Trip Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ padding: '16px', textAlign:'left' }}>
          <Typography  variant="body1">{title}</Typography>
          <Typography variant="body2">
          <Link href="https://weinwien.com" target="_blank" rel="noopener noreferrer">
            {link}
          </Link>
          </Typography>
        </Box>
      </Box>
    )
}