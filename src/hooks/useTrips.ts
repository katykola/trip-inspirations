import { useState } from 'react';
import { useQuery } from 'react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Trip } from '../types/types';

const fetchTrips = async (userId: string | undefined, setReadCount: (count: number) => void): Promise<Trip[]> => {
  if (!userId) {
    return [];
  }
  const tripsQuery = query(collection(db, 'trips'), where('userId', '==', userId));
  const data = await getDocs(tripsQuery);
  setReadCount(data.size); // Increment read count
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Trip[];
};

export const useTrips = (userId: string | undefined) => {

  const [readCount, setReadCount] = useState(0); // State variable to track Firestore reads

  const queryResult = useQuery<Trip[], Error>(['trips', userId], () => fetchTrips(userId, setReadCount), {
    enabled: !!userId, // Only run the query if userId is defined
  });

  console.log(`Read count in useTrips: ${readCount}`); // Log read count

  return { ...queryResult, readCount };
};