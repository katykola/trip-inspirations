import { useState } from 'react';
import { useQuery } from 'react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Trip } from '../types/types';

const fetchTripsByCollectionId = async (collectionId: string | undefined, setReadCount: (count: number) => void): Promise<Trip[]> => {
  if (!collectionId) {
    return [];
  }
  const tripsQuery = query(collection(db, 'trips'), where('collection', '==', collectionId));
  const data = await getDocs(tripsQuery);
  setReadCount(data.size); // Increment read count
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Trip[];
};

export const useTripsByCollectionId = (collectionId: string | undefined) => {
  const [readCount, setReadCount] = useState(0); // State variable to track Firestore reads

  const queryResult = useQuery<Trip[], Error>(['trips', collectionId], () => fetchTripsByCollectionId(collectionId, setReadCount), {
    enabled: !!collectionId, // Only run the query if collectionId is defined
  });

  console.log(`Read count in useTripsByCollectionId: ${readCount}`); // Log read count

  return { ...queryResult, readCount };
};