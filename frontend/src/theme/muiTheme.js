// src/theme/muiTheme.js
import { createTheme } from "@mui/material/styles";

/**
 * Custom Material UI theme
 *
 * Dark, slightly neon style to match the RAG Physics Tutor UI:
 * - Deep navy background
 * - Purple primary, orange secondary
 * - Rounded components with subtle shadows
 *
 * We export a function (getMuiTheme) because App.js calls it like:
 *   const theme = getMuiTheme();
 */
const getMuiTheme = () =>
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#8B5CF6", // purple
        light: "#A855F7",
        dark: "#6D28D9",
      },
      secondary: {
        main: "#F97316", // orange
        light: "#FDBA74",
        dark: "#EA580C",
      },
      background: {
        default: "#020617", // tailwind slate-950-ish
        paper: "rgba(15,23,42,0.96)", // slightly translucent panel
      },
      text: {
        primary: "#E5E7EB",
        secondary: "#9CA3AF",
      },
      error: {
        main: "#F97373",
      },
      success: {
        main: "#22C55E",
      },
      warning: {
        main: "#FACC15",
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: [
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontWeight: 700,
        letterSpacing: 0.5,
      },
      h2: {
        fontWeight: 700,
        letterSpacing: 0.4,
      },
      h3: {
        fontWeight: 600,
        letterSpacing: 0.3,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: 0.4,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            backgroundImage: "none",
            boxShadow: "0 18px 45px rgba(15,23,42,0.85)",
            border: "1px solid rgba(148,163,184,0.2)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
            paddingInline: 24,
            paddingBlock: 10,
            boxShadow: "0 10px 30px rgba(139,92,246,0.45)",
            "&:disabled": {
              boxShadow: "none",
              opacity: 0.6,
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 14,
              backgroundColor: "rgba(15,23,42,0.9)",
              "& fieldset": {
                borderColor: "rgba(148,163,184,0.5)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(129,140,248,0.9)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#A855F7",
                boxShadow: "0 0 0 1px rgba(168,85,247,0.4)",
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
            backgroundColor: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(148,163,184,0.4)",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });

export default getMuiTheme;
