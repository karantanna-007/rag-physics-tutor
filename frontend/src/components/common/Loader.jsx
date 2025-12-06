// src/components/common/Loader.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * Loader
 *
 * Props:
 * - text?: string  // Optional message under the spinner
 * - fullScreen?: boolean // If true, centers in full viewport height
 */
const Loader = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...(fullScreen
          ? {
              height: "100vh",
            }
          : {
              py: 4,
            }),
      }}
    >
      <CircularProgress />
      {text && (
        <Typography
          variant="body2"
          sx={{ mt: 2, opacity: 0.8, textAlign: "center" }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
