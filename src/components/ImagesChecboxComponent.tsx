import { Grid, Box, Checkbox } from '@mui/material';

interface ImagesCheckboxComponentProps {
    index: number;
    image: string;
    selectedImages: string[];
    handleImageCheckboxChange: (image: string) => void;
}

export default function ImagesCheckboxComponent({ index, image, selectedImages, handleImageCheckboxChange } : ImagesCheckboxComponentProps) {
    return (
        <Grid item xs={6} sm={4} key={index}>
        <Box sx={{ position: 'relative' }}>
          <img src={image} alt={`Scraped image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          <Checkbox
            checked={selectedImages.includes(image)}
            onChange={() => handleImageCheckboxChange(image)}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'white',
              '& .MuiSvgIcon-root': {
                backgroundColor: 'white',
              }, 
            }}
          />
        </Box>
      </Grid>
    )
}