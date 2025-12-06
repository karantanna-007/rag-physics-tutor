// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";

/**
 * LoginForm
 *
 * Props:
 * - onSubmit: ({ email, password }) => void | Promise<void>
 * - isLoading?: boolean
 * - error?: string | null
 */
const LoginForm = ({ onSubmit, isLoading = false, error = null }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (field) => (event) => {
    setValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setLocalError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!values.email.trim() || !values.password.trim()) {
      setLocalError("Please enter both email and password.");
      return;
    }

    // Let page / hook handle actual API + errors
    onSubmit({
      email: values.email.trim(),
      password: values.password,
    });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: 460,
        mx: "auto",
        mt: 6,
        p: 3,
        borderRadius: 3,
        backgroundColor: "rgba(15,23,42,0.95)",
        border: "1px solid rgba(148,163,184,0.5)",
      }}
    >
      <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
        Welcome back 👋
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ mb: 2, opacity: 0.8 }}
      >
        Login to continue chatting with your Physics Tutor and access your notes.
      </Typography>

      {localError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}

      {error && typeof error === "string" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange("email")}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange("password")}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ fontSize: 20 }} />
                  ) : (
                    <Visibility sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </Box>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 1, opacity: 0.8 }}
      >
        Don&apos;t have an account?{" "}
        <MuiLink component={Link} to="/register" underline="hover">
          Register
        </MuiLink>
      </Typography>
    </Paper>
  );
};

export default LoginForm;
