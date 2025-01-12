import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';
import Header from '../components/Header';
import HomePage from '../pages/HomePage';
import LogOutPage from '../pages/LogOutPage';
import TripNew from '../pages/TripNew';
import TripDetailPage from '../pages/TripDetailPage';
import TripEditForm from '../components/TripEditForm';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';
import { VisibleTripsProvider } from '../context/VisibleTripsContext';


export default function AppRouter() {

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const authContext = useAuth();
    return authContext && authContext.user ? children : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <LocationProvider>
        <VisibleTripsProvider>
        <Router>
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexShrink: 0 }}>
              <Header />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Routes>
                <Route
                    path="/login"
                    element={<LoginPage/>}
                  />
                  <Route
                    path="/signup"
                    element={<SignUpPage/>}
                  />
                  <Route
                    path="/"
                    element={
                      <HomePage/>
                    }
                  />
                  <Route
                    path="/logout"
                    element={
                      <LogOutPage/>
                    }
                  />
                  <Route
                    path="/user/:userId/home"
                    element={
                    <ProtectedRoute>
                      <HomePage/>
                    </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/new"
                    element={<TripNew />}
                  />
                  <Route
                    path="/trip/:id"
                    element={<TripDetailPage/>
                    }
                  />
                  <Route
                    path="/trip/:id/edit"
                    element={<TripEditForm/>}
                  />
                </Routes>
            </Box>
          </Box>
        </Router>
      </VisibleTripsProvider>
      </LocationProvider>
    </AuthProvider>
  );
}