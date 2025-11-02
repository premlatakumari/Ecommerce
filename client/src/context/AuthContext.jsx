import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (initialized) return;

      try {
        setLoading(true);
        const response = await authService.getCurrentUser();
        if (response.success && isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, [initialized]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response && response.success) {
        setUser(response.user);
        return {
          success: true,
          message: response.message,
          user: response.user,
        };
      } else {
        return {
          success: false,
          message: response?.message || "Login failed"
        };
      }
    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await authService.verifyOTP(email, otp);
      if (response.success) {
        setUser(response.user);
        return { success: true, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "OTP verification failed",
      };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await authService.resendOTP(email);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to resend OTP",
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to send reset email",
      };
    }
  };

  const resetPassword = async (token, newPassword, confirmNewPassword) => {
    try {
      const response = await authService.resetPassword(
        token,
        newPassword,
        confirmNewPassword
      );
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Password reset failed",
      };
    }
  };

  const updatePassword = async (
    currentPassword,
    newPassword,
    confirmNewPassword
  ) => {
    try {
      const response = await authService.updatePassword(
        currentPassword,
        newPassword,
        confirmNewPassword
      );
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Password update failed",
      };
    }
  };

  // Derived state for easy checks
  const isAuthenticated = !!user;
  const isAdmin = user && user.role === "Admin";
  const isActive = user && user.status === "active";

  // The value provided globally
  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isActive,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    setUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
