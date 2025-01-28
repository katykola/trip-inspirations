import { Box, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCollection } from "../context/CollectionContext";
import { useVisibleTrips } from '../context/VisibleTripsContext';
import { smallScreenBreakpoint } from '../utils/breakpoints';



interface CollectionTileProps {
    id: string;
    name: string;
    images: string[] | undefined;
}

export default function CollectionTile({ id, name, images }: CollectionTileProps) {

    const isMobile = useMediaQuery(smallScreenBreakpoint);

    const navigate = useNavigate();

    const { setSelectedTripId } = useVisibleTrips();
    const { setSelectedCollection, setCollectionName } = useCollection();

    const handleClick = () => {
        setSelectedCollection(id);
        setCollectionName(name);
        setSelectedTripId('');
        navigate(`/collection/${id}`);
    };
    
    return (
        <Box
        onClick={handleClick}
        sx={{
            flex: '0 0 auto', 
            width: isMobile ? '100%' : '350px', 
            border: '1px solid #ddd',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '1rem',
            marginRight: '1rem',
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
            {images? images.map((image, index) => (
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
            )) : null}
        </Box>
        <Typography
            variant="h5"
            sx={{
                textAlign: 'center',
                color: '#333',
            }}
        >
            {name}
        </Typography>
    </Box>
    );
}