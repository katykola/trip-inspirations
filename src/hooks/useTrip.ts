import { useQuery } from 'react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Trip } from '../types/types';

const fetchTrip = async (id: string): Promise<Trip | null> => {
  if (!id) {
    throw new Error('Invalid document reference. Document ID is required.');
  }
  const docRef = doc(db, 'trips', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Trip;
  } else {
    console.error('No such document!');
    return null;
  }
};

export const useTrip = (id: string) => {
  return useQuery<Trip | null, Error>(['trip', id], () => fetchTrip(id), {
    enabled: !!id, // Only run the query if the id is not empty
  });
};