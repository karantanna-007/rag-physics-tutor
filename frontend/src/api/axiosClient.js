// src/api/axiosClient.js
import axios from "axios";
import { getToken, clearToken } from "../utils/storage";

// Base URL of FastAPI backend
// Example .env: REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
const baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

// Create a single shared axios instance
const axiosClient = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach JWT token automatically to every request (if present)
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize errors a bit and handle 401 globally (optional logout later)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend sends FastAPI error shape { detail: "..." } or { detail: [...] }
    if (error?.response?.data?.detail) {
      const detail = error.response.data.detail;

      // Convert validation errors array -> readable string
      if (Array.isArray(detail)) {
        const messages = detail.map((d) => d.msg || JSON.stringify(d));
        error.normalizedMessage = messages.join("; ");
      } else if (typeof detail === "string") {
        error.normalizedMessage = detail;
      } else {
        error.normalizedMessage = JSON.stringify(detail);
      }
    } else if (error?.message) {
      error.normalizedMessage = error.message;
    } else {
      error.normalizedMessage = "An unexpected error occurred.";
    }

    // Optional: if token is invalid/expired, clear it
    if (error?.response?.status === 401) {
      clearToken();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
