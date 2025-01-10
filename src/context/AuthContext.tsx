import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types/types';

interface AuthContextProps {
  user: User | null;
  logout: () => void;
  filteredTrips: Trip[];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: trips } = useTrips();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe()
    };
  }, [user]);
  
  const logout = () => {
    signOut(auth);
  };

  const filteredTrips = useMemo(() => {
    if (trips && trips.length > 0 && user !== null) {
      return trips;
    } else if (trips && trips.length > 0 && !user) {
      return trips.filter(trip => trip.public);
    }
    return [];
  }, [user, trips]);
  
  return (
    <AuthContext.Provider value={{ user, logout, filteredTrips }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};