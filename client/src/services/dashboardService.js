import { dashboardApi } from '../lib/index.js';

export const dashboardService = {
  // Admin Services
  admin: {
    getAllUsers: async (params = {}) => {
      try {
        return await dashboardApi.admin.getAllUsers(params);
      } catch (error) {
        throw error;
      }
    },

    // Update user status
    updateUserStatus: async (userId, status) => {
      try {
        return await dashboardApi.admin.updateUserStatus(userId, status);
      } catch (error) {
        throw error;
      }
    },

    // Get dashboard statistics
    getDashboardStats: async () => {
      try {
        return await dashboardApi.admin.getDashboardStats();
      } catch (error) {
        throw error;
      }
    },

    // Get admin profile
    getAdminProfile: async () => {
      try {
        return await dashboardApi.admin.getAdminProfile();
      } catch (error) {
        throw error;
      }
    }
  },

  // User Services
  user: {
    // Get user profile
    getUserProfile: async () => {
      try {
        return await dashboardApi.user.getUserProfile();
      } catch (error) {
        throw error;
      }
    }
  },

  // User Services
  user: {
    // Get user profile
    getUserProfile: async () => {
      try {
        return await dashboardApi.user.getUserProfile();
      } catch (error) {
        throw error;
      }
    }
  }
};