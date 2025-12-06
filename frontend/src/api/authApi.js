// src/api/authApi.js
import axiosClient from "./axiosClient";

/**
 * Login
 * Backend returns:
 * {
 *   "access_token": "...",
 *   "token_type": "bearer",
 *   "user": { ... }
 * }
 */
export const login = async ({ email, password }) => {
  const response = await axiosClient.post("/auth/login", { email, password });
  const data = response.data || {};

  // Normalize shape for the rest of the app
  return {
    token: data.access_token || data.token || "",
    tokenType: data.token_type || "bearer",
    user: data.user || null,
  };
};

/**
 * Register
 * Same TokenResponse as login.
 */
export const register = async ({ name, email, password }) => {
  const response = await axiosClient.post("/auth/register", {
    name,
    email,
    password,
  });
  const data = response.data || {};

  return {
    token: data.access_token || data.token || "",
    tokenType: data.token_type || "bearer",
    user: data.user || null,
  };
};

/**
 * getMe
 * Only used on refresh when we already have a token
 */
export const getMe = async (token) => {
  const response = await axiosClient.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
