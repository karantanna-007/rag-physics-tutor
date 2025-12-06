// src/App.js
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

import AppRouter from "./routes/AppRouter";
import getMuiTheme from "./theme/muiTheme";
import { ThemeProvider as AppThemeProvider, useThemeContext } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Inner app that can read the current theme mode from ThemeContext
function AppWithTheme() {
  const { mode } = useThemeContext(); // "light" | "dark"

  return (
    <MuiThemeProvider theme={getMuiTheme(mode)}>
      <CssBaseline />
      <AppRouter />
    </MuiThemeProvider>
  );
}

// Root App component that provides Theme & Auth context to the whole app
function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppWithTheme />
        </BrowserRouter>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;
