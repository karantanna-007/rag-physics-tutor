// src/components/common/ErrorAlert.jsx
import React from "react";
import { Alert } from "@mui/material";

/**
 * Normalize different error shapes into a human-readable string.
 *
 * Handles:
 * - string
 * - Error instance (err.message)
 * - Axios error with response.data.message
 * - FastAPI validation error: { detail: [{ msg, type, ... }, ...] }
 */
const getErrorMessage = (error) => {
  if (!error) return "";

  // Already a string
  if (typeof error === "string") return error;

  // Standard Error instance
  if (error instanceof Error && error.message) return error.message;

  // Axios-style: error.response.data.message
  const resp = error.response?.data || error.data;
  if (resp) {
    if (typeof resp === "string") return resp;
    if (typeof resp.message === "string") return resp.message;

    // FastAPI validation: { detail: [...] }
    if (Array.isArray(resp.detail) && resp.detail.length > 0) {
      // Take first message
      const first = resp.detail[0];
      if (typeof first === "string") return first;
      if (first.msg) return first.msg;
      if (first.type) return `Validation error: ${first.type}`;
    }
  }

  // Direct error.detail
  if (Array.isArray(error.detail) && error.detail.length > 0) {
    const first = error.detail[0];
    if (first?.msg) return first.msg;
  }

  if (typeof error.message === "string") return error.message;

  // Fallback
  return "An unexpected error occurred. Please try again.";
};

/**
 * ErrorAlert
 *
 * Props:
 * - error: any (string, Error, Axios error, FastAPI error, etc.)
 * - severity?: "error" | "warning" | "info" | "success"
 * - onClose?: () => void
 * - sx?: object (MUI sx prop)
 */
const ErrorAlert = ({ error, severity = "error", onClose, sx }) => {
  if (!error) return null;

  const message = getErrorMessage(error);

  if (!message) return null;

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      sx={{ mb: 2, ...sx }}
    >
      {message}
    </Alert>
  );
};

export default ErrorAlert;
