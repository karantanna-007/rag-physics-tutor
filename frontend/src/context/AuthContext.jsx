// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import * as authApi from "../api/authApi";
import { getToken, setToken as storeToken, clearToken } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // --- Initialize from localStorage on first load ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = getToken();
        if (!storedToken) {
          setIsInitializing(false);
          return;
        }

        setTokenState(storedToken);

        // Ask backend who this token belongs to
        const me = await authApi.getMe(storedToken);
        setUser(me);
      } catch (err) {
        console.error("Auth initialization error:", err);
        clearToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const handleAuthSuccess = useCallback((newToken, userData) => {
    if (!newToken || !userData) {
      console.error("Auth success called with invalid token/user:", {
        newToken,
        userData,
      });
    }

    setTokenState(newToken);
    storeToken(newToken);
    setUser(userData);
    setAuthError(null);
  }, []);

  // --- Login ---
  const login = async ({ email, password }) => {
    setIsAuthActionLoading(true);
    setAuthError(null);

    try {
      const { token: newToken, user: userData } = await authApi.login({
        email,
        password,
      });

      if (!newToken || !userData) {
        throw new Error("Login response missing token or user");
      }

      handleAuthSuccess(newToken, userData);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your email and password."
      );
      clearToken();
      setTokenState(null);
      setUser(null);
      throw err;
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // --- Register ---
  const register = async ({ name, email, password }) => {
    setIsAuthActionLoading(true);
    setAuthError(null);

    try {
      const { token: newToken, user: userData } = await authApi.register({
        name,
        email,
        password,
      });

      if (!newToken || !userData) {
        throw new Error("Register response missing token or user");
      }

      handleAuthSuccess(newToken, userData);
    } catch (err) {
      console.error("Register error:", err);
      setAuthError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
      clearToken();
      setTokenState(null);
      setUser(null);
      throw err;
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // --- Logout ---
  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setAuthError(null);
  };

  // --- Refresh /me manually if needed ---
  const refreshUser = async () => {
    if (!token) return;
    try {
      const me = await authApi.getMe(token);
      setUser(me);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isInitializing,
    isAuthActionLoading,
    authError,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
