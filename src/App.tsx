import { useState, useEffect } from 'react';
import './App.css';
import { db } from './config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import MainScreen from './screens/MainScreen';
import { Trip } from './types/types';

export default function App() {

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
    <MainScreen trips={trips}/>
  );
}