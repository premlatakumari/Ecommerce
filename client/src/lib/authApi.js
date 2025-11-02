import apiClient from './apiClient.js';

export const authApi = {
  // Register user
  register: async (userData) => {
    const formData = new FormData();
    
    // Add all fields to FormData
    formData.append('name', userData.name || '');
    formData.append('email', userData.email || '');
    formData.append('phone', userData.phone || '');
    formData.append('password', userData.password || '');
    formData.append('address', userData.address || '');
    formData.append('dateOfBirth', userData.dateOfBirth || '');
    
    // Add avatar file if present
    if (userData.avatar && userData.avatar instanceof File) {
      formData.append('avatar', userData.avatar);
    }
    
    return await apiClient.post('/auth/register', formData);
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    return await apiClient.post('/auth/verify-otp', { email, otp });
  },

  // Resend OTP
  resendOTP: async (email) => {
    return await apiClient.post('/auth/resend-otp', { email });
  },

  // Login user
  login: async (email, password) => {
    return await apiClient.post('/auth/login', { email, password });
  },

  // Logout user
  logout: async () => {
    return await apiClient.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await apiClient.post('/auth/password/forgot', { email });
  },

  // Validate reset token
  validateResetToken: async (token) => {
    return await apiClient.get(`/auth/password/validate/${token}`);
  },

  // Reset password
  resetPassword: async (token, newPassword, confirmNewPassword) => {
    return await apiClient.put(`/auth/password/reset/${token}`, {
      newPassword,
      confirmNewPassword
    });
  },

  // Update password
  updatePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    return await apiClient.put('/auth/password/update', {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
  }
};