// src/pages/RegisterPage.jsx
import React from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  const { register, isAuthActionLoading, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ name, email, password }) => {
    try {
      await register({ name, email, password });
      navigate("/", { replace: true });
    } catch {
      // handled by auth context error
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 520,
          width: "100%",
          p: 3,
          borderRadius: 4,
          backgroundColor: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(148,163,184,0.5)",
        }}
        elevation={8}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
          Create your account
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          Register to save your conversations, preferences, and uploaded
          documents.
        </Typography>

        {authError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {authError}
          </Alert>
        )}

        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isAuthActionLoading}
          error={null}
        />

        <Typography
          variant="body2"
          sx={{ mt: 2, opacity: 0.8, textAlign: "center" }}
        >
          Already have an account?{" "}
          <RouterLink
            to="/login"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Login
          </RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
