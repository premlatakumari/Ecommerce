// src/services/authService.js

import { authApi } from '../lib/index.js';

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      return await authApi.register(userData);
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      return await authApi.verifyOTP(email, otp);
    } catch (error) {
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      return await authApi.resendOTP(email);
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      return await authApi.login(email, password);
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      return await authApi.logout();
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      return await authApi.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  },

  // Validate reset token
  validateResetToken: async (token) => {
    try {
      return await authApi.validateResetToken(token);
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword, confirmNewPassword) => {
    try {
      return await authApi.resetPassword(token, newPassword, confirmNewPassword);
    } catch (error) {
      throw error;
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      return await authApi.updatePassword(currentPassword, newPassword, confirmNewPassword);
    } catch (error) {
      throw error;
    }
  }
};