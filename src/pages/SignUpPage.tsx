import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { TextField, Button, Typography, Stack } from "@mui/material";
import { menuBarHeight } from "../utils/styling";
import BackgroundImage from "../components/BackgroundImage";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  };

  return (
    <Stack
    sx={{
      position: "relative",
      minHeight: `calc(100vh - ${menuBarHeight})`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "grey.50",
    }}
    >
      <BackgroundImage />
      <Stack
      spacing={2}
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
          <Typography variant="h4">Sign Up</Typography>
          <form onSubmit={handleSignup}>
            <Stack spacing={3}>
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
                <Button type="submit" variant="contained">Sign Up</Button>
                <Stack spacing={1}>
                  <Typography variant="body2">Have you alreay signed up?</Typography>
                  <Button variant="outlined" href="/login">Log In</Button>
                </Stack>
            </Stack>
          </form>
      </Stack>
    </Stack>
  );
};

export default Signup;
