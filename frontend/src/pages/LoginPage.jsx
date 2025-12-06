// src/pages/LoginPage.jsx
import React from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  const { login, isAuthActionLoading, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    try {
      await login({ email, password });
      navigate("/", { replace: true });
    } catch {
      // error already set in context
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
          maxWidth: 480,
          width: "100%",
          p: 3,
          borderRadius: 4,
          backgroundColor: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(148,163,184,0.5)",
        }}
        elevation={8}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          Login to your RAG Physics Tutor dashboard.
        </Typography>

        {authError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {authError}
          </Alert>
        )}

        <LoginForm onSubmit={handleSubmit} isLoading={isAuthActionLoading} />

        <Typography
          variant="body2"
          sx={{ mt: 2, opacity: 0.8, textAlign: "center" }}
        >
          New here?{" "}
          <RouterLink
            to="/register"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Create an account
          </RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
