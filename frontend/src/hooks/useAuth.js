// src/hooks/useAuth.js
import { useAuthContext } from "../context/AuthContext";

/**
 * useAuth
 *
 * Provides:
 * - user
 * - token
 * - isAuthenticated
 * - isInitializing
 * - isAuthActionLoading
 * - authError
 * - login({ email, password })
 * - register({ name, email, password })
 * - logout()
 * - refreshUser()
 * - clearAuthError()
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
