import { useEffect } from "react";
import { useLocation } from '../context/LocationContext';
import { useNavigate } from "react-router-dom";

export default function LogOutPage() {
  const { currentLocation, setSearchedLocation } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSearchedLocation(currentLocation || [48.210033, 16.363449]);
    navigate('/');
  }, [currentLocation, setSearchedLocation, navigate]);

  return (
    <div>
      <h1>You have been logged out.</h1>
    </div>
  );
}