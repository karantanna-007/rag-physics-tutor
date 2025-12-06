// src/components/layout/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // While we’re checking localStorage token + /auth/me
  if (isInitializing) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
          color: "#e5e7eb",
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Restoring your session...
        </Typography>
      </Box>
    );
  }

  // Not authenticated → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render children
  return children;
};

export default ProtectedRoute;
