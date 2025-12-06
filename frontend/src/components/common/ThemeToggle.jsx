// src/components/common/ThemeToggle.jsx
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeContext } from "../../context/ThemeContext";

/**
 * ThemeToggle
 *
 * Small icon button to toggle light/dark mode.
 */
const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeContext();
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        size="small"
        sx={{
          ml: 1,
          borderRadius: 999,
          border: "1px solid rgba(148,163,184,0.5)",
          padding: 0.5,
        }}
      >
        {isDark ? (
          <LightModeIcon fontSize="small" />
        ) : (
          <DarkModeIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
