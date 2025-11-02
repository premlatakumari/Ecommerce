// src/utils/api.js

import axios from 'axios';

// **IMPORTANT: Set your actual Backend API URL here**
const API_BASE_URL = 'http://localhost:5000/api/v1'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookie-based auth
    timeout: 10000, // 10 second timeout
});

// **Interceptor:** This runs BEFORE every request is sent
api.interceptors.request.use(
    (config) => {
        // Ensure credentials are always sent
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// **Response Interceptor:** Handle responses and errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle different types of errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        } else if (error.response?.status === 401) {
            // Token expired or invalid - handled by AuthContext
            console.warn('Authentication failed - redirecting to login');
        } else if (error.response?.status === 403) {
            console.error('Access forbidden');
        } else if (error.response?.status >= 500) {
            console.error('Server error:', error.response?.data?.message);
        }
        return Promise.reject(error);
    }
);

export default api;