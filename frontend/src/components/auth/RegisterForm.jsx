// src/components/auth/RegisterForm.jsx
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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";

/**
 * RegisterForm
 *
 * Props:
 * - onSubmit: ({ name, email, password }) => void | Promise<void>
 * - isLoading?: boolean
 * - error?: string | null
 */
const RegisterForm = ({ onSubmit, isLoading = false, error = null }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !values.name.trim() ||
      !values.email.trim() ||
      !values.password.trim() ||
      !values.confirmPassword.trim()
    ) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (values.password.length < 6) {
      setLocalError("Password should be at least 6 characters long.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
    });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: 6,
        p: 3,
        borderRadius: 3,
        backgroundColor: "rgba(15,23,42,0.95)",
        border: "1px solid rgba(148,163,184,0.5)",
      }}
    >
      <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
        Create your Physics Tutor account ✨
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ mb: 2, opacity: 0.8 }}
      >
        Save your chat history, documents and preferences in one place.
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
          label="Full Name"
          value={values.name}
          onChange={handleChange("name")}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

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
          autoComplete="new-password"
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

        <TextField
          margin="normal"
          fullWidth
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ fontSize: 20 }} />
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
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </Box>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 1, opacity: 0.8 }}
      >
        Already have an account?{" "}
        <MuiLink component={Link} to="/login" underline="hover">
          Login
        </MuiLink>
      </Typography>
    </Paper>
  );
};

export default RegisterForm;
