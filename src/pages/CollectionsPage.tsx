import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { menuBarHeight } from '../utils/styling';
import CollectionTile from '../components/CollectionTile';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../config/firebase-config';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'collections'));
        const collectionsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const collectionData = { id: doc.id, ...doc.data() };
            const tripsQuery = query(
              collection(db, 'trips'),
              where('collections', 'array-contains', doc.id),
              limit(3)
            );
            const tripsSnapshot = await getDocs(tripsQuery);
            const tripImages = tripsSnapshot.docs.map(tripDoc => tripDoc.data().images[0]).filter(Boolean);
            console.log(tripImages);
            return { ...collectionData, images: tripImages };
          })
        );
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <Stack
      sx={{
        backgroundColor: '#F2EEE8',
        height: `calc(100vh - ${menuBarHeight})`,
        padding: '2rem',
        overflowX: 'hidden', // Prevent horizontal overflow
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: 'auto', // Enable horizontal scrolling if content overflows
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
        {collections.map(collection => (
          <CollectionTile key={collection.id} name={collection.title} images={collection.images} />
        ))}
      </Stack>
    </Stack>
  );
}