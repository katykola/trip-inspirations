import { useState, useEffect } from 'react';
import { Stack, useMediaQuery } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { menuBarHeight } from '../utils/styling';
import CollectionTile from '../components/CollectionTile';
import { collection as firestoreCollection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useCollections } from '../hooks/useCollections';
import { Collection } from '../types/types';
import { smallScreenBreakpoint } from '../utils/breakpoints';

export default function CollectionsPage() {

  const isMobile = useMediaQuery(smallScreenBreakpoint);

  const { user } = useAuth();
  const userId = user?.uid || '';
  const { data: collections = [], isLoading, error } = useCollections(userId);
  const [collectionsWithImages, setCollectionsWithImages] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchTripsForCollections = async () => {
      const updatedCollections = await Promise.all(
        collections.map(async (collection) => {
          const tripsQuery = query(
            firestoreCollection(db, 'trips'),
            where('collection', '==', collection.id),
            limit(3)
          );
          const tripsSnapshot = await getDocs(tripsQuery);
          const tripImages = tripsSnapshot.docs.map(tripDoc => tripDoc.data().images[0]).filter(Boolean);
          return { ...collection, images: tripImages };
        })
      );
      setCollectionsWithImages(updatedCollections);
    };

    if (collections.length > 0) {
      fetchTripsForCollections();
    }
  }, [collections]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching collections: {error.message}</div>;
  }

  return (
    <Stack
      sx={{
        backgroundColor: '#F2EEE8',
        height: isMobile ? 'inherit' : `calc(100vh - ${menuBarHeight})`,
        padding: '2rem',
        paddingTop: isMobile ? '4rem' : '2rem',
        overflowX: 'hidden', 
      }}
    >
      <Stack
      direction={isMobile ? "column" : "row"}
      sx={{
        flexWrap: 'wrap', // Allow items to wrap to the next row     
        alignItems: 'flex-start', // Align items to the start of the row     
        paddingBottom: '1rem',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#aaa',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f0f0f0',
        },
      }}
      >
        {collectionsWithImages.map(collection => (
          <CollectionTile key={collection.id} id={collection.id} name={collection.title} images={collection.images} />
        ))}
      </Stack>
    </Stack>
  );
}