import { useQuery } from 'react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Trip } from '../types/types';

const fetchTrips = async (): Promise<Trip[]> => {
  const data = await getDocs(collection(db, 'DUMMY_DATA'));
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Trip[];
};

export const useTrips = () => {
  return useQuery<Trip[], Error>('trips', fetchTrips);
};