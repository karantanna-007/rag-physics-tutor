// src/pages/NotFoundPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 480,
          color: "#e5e7eb",
        }}
      >
        <Typography variant="h1" sx={{ fontSize: 72, fontWeight: 800, mb: 1 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Page not found
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          The page you're looking for doesn&apos;t exist. Maybe you closed a
          tab from another dimension 🤔
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Tutor
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
