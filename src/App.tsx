import './App.css';
import { useTrips } from './hooks/useTrips';
import HomePage from './pages/HomePage';


export default function App() {

  const { data: trips, isLoading, error } = useTrips();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <HomePage trips={trips || []}/>
  );
}