import apiClient from './apiClient.js';

export const dashboardApi = {
  // Admin Services
  admin: {
    getAllUsers: async (params = {}) => {
      const { page = 1, limit = 10, status, search } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search })
      });

      return await apiClient.get(`/dashboard/admin/users?${queryParams}`);
    },

    // Update user status
    updateUserStatus: async (userId, status) => {
      return await apiClient.patch(`/dashboard/admin/users/${userId}/status`, {
        status
      });
    },

    // Get dashboard statistics
    getDashboardStats: async () => {
      return await apiClient.get('/dashboard/admin/stats');
    },

    // Get admin profile
    getAdminProfile: async () => {
      return await apiClient.get('/dashboard/admin/profile');
    }
  },

  // User Services
  user: {
    // Get user profile
    getUserProfile: async () => {
      return await apiClient.get('/dashboard/user/profile');
    }
  }
};