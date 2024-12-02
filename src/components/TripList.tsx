import { useState, useEffect } from 'react';
import { Stack } from '@mui/material'; 
import TripTile from './TripTile';
import { db } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

interface Trip {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
}

interface TripListProps {
  onTripSelect: (id: string) => void;
}

export default function TripList({ onTripSelect }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const getTrips = async () => {
      try {
        const data = await getDocs(collection(db, 'DUMMY_DATA'));
        const filteredData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Trip[];
        setTrips(filteredData);
      } catch (error) {
        console.error('Error getting documents: ', error);  
      }
    };
    getTrips();
  }, []);

  return (
    <Stack>
      {trips.map((trip) => (
        <TripTile key={trip.id} id={trip.id} title={trip.title} link={trip.link}  onTripSelect={onTripSelect} />
      ))}
    </Stack>
  );
}