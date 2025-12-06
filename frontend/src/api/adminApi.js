// src/api/adminApi.js
import axiosClient from "./axiosClient";

/**
 * Admin APIs (optional / future).
 * These assume you have role-based access control in the backend.
 * Right now they’re simple placeholders you can hook to actual routes later.
 */

/**
 * Example: get system health / diagnostics (wraps /health).
 * You can call this in a special admin dashboard if you create one later.
 */
export const getSystemHealth = async () => {
  const response = await axiosClient.get("/health");
  return response.data;
};

/**
 * Example: list all users (if backend has /admin/users).
 */
export const listUsers = async () => {
  const response = await axiosClient.get("/admin/users");
  return response.data;
};

/**
 * Example: promote a user to admin.
 */
export const promoteUserToAdmin = async (userId) => {
  const response = await axiosClient.post(`/admin/users/${userId}/promote`);
  return response.data;
};
