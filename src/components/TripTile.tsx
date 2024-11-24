import { Box, Typography, Link } from '@mui/material';

export default function TripTile(){
    return(
        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', maxWidth: '400px', margin: '16px', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ height: '200px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1633258771437-f56a2d916738?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFscHN8ZW58MHwwfDB8fHwy"
            alt="Trip Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ padding: '16px' }}>
          <Typography variant="h6">Titulek článku s výletem</Typography>
          <Link href="https://weinwien.com" target="_blank" rel="noopener noreferrer">
            https://wirinwien.com
          </Link>
        </Box>
      </Box>
    )
}