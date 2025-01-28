import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { TextField, Button, Typography, Stack, useMediaQuery } from "@mui/material";
import { useAuth } from '../context/AuthContext';
import { menuBarHeight } from "../utils/styling";
import BackgroundImage from "../components/BackgroundImage";
import { smallScreenBreakpoint } from "../utils/breakpoints";

const Login = () => {
  const isMobile = useMediaQuery(smallScreenBreakpoint);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
        navigate(`/collections`);
      }  
    }, [user])

  return (
      <>
        <Stack
          sx={{
            position: "relative",
            minHeight: `calc(100vh - ${menuBarHeight})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "grey.50",
            px: isMobile ? '2rem' : 0,
          }}
        >
          <BackgroundImage />
          <Stack
            spacing={3}
            sx={{
              maxWidth: "400px",
              width: "100%",
              zIndex: 1, 
              p: "2rem",
              textAlign: "center",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              backgroundColor: "grey.50",
            }}
          >
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
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </>
  );
};

export default Login;
