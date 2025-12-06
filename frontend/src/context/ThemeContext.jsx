// src/context/ThemeContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSavedTheme, saveTheme } from "../utils/storage";

const ThemeContext = createContext(null);

/**
 * ThemeProvider
 *
 * Manages the current color mode ("dark" | "light").
 * We default to "dark" to match the RAG Physics Tutor UI.
 *
 * App.js will read `mode` and decide which MUI theme to apply.
 */
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = getSavedTheme();
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  // Persist mode in localStorage so it survives reloads
  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newMode) => {
    if (newMode === "dark" || newMode === "light") {
      setMode(newMode);
    }
  };

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      setTheme,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return ctx;
};


