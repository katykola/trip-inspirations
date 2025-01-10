import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { TextField, Button, Typography, Stack } from "@mui/material";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  };

  useEffect(()=>{
    if (user) {
        navigate(`/user/${user.uid}/home`);
      }  
    }, [user])

  return (
    <>
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h4">Log in</Typography>
        <form onSubmit={handleLogin}>
        <Stack spacing={2}>
            <TextField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
        </Stack>
        </form>
    </Stack>
    </>
  );
};

export default Login;
