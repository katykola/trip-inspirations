import { useQuery } from 'react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Trip } from '../types/types';

const fetchTrips = async (userId: string | undefined): Promise<Trip[]> => {
  if (!userId) {
    return [];
  }
  const tripsQuery = query(collection(db, 'trips'), where('userId', '==', userId));
  const data = await getDocs(tripsQuery);
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Trip[];
};

export const useTrips = (userId: string | undefined) => {
  return useQuery<Trip[], Error>(['trips', userId], () => fetchTrips(userId), {
    enabled: !!userId, // Only run the query if userId is defined
  });
};