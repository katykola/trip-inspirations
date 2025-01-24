import { Box, Typography, Button } from '@mui/material';

interface CollectionTileProps {
    name: string;
    images: string[];
}

export default function CollectionTile({ name, images }: CollectionTileProps) {
    return (
        <Box
        sx={{
            flex: '0 0 auto', // Prevent boxes from shrinking
            width: '300px', // Fixed width to fit in the container
            border: '1px solid #ddd',
            borderRadius: '1rem',
            padding: '1rem',
            backgroundColor: 'white',
            boxShadow: '0 4px 5px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                boxShadow: '0 4px 5px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
            },
        }}
    >
        {/* Images in a row */}
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '0.5rem',
                marginBottom: '1rem',
                width: '100%',
                height: '100px',
            }}
        >
            {images.map((image, index) => (
                <Box
                    key={index}
                    sx={{
                        width: 'calc(33.33% - 0.33rem)', // Three images equally spaced in a row
                        height: '100px',
                        overflow: 'hidden',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
            ))}
        </Box>
        {/* Title */}
        <Typography
            variant="h5"
            sx={{
                textAlign: 'center',
                fontWeight: '600',
                color: '#333',
            }}
        >
            {name}
        </Typography>
        <Button variant='outlined'>Delete</Button>
    </Box>
    );
}