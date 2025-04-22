import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

// Create the axios instance
const api = axios.create();

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.clear();
          console.log("No refresh token available");
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        console.log("Attempting to refresh token");
        
        // Call refresh endpoint with regular axios to avoid interceptor loop
        const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
          refresh_token: refreshToken
        });
        
        console.log("Token refresh successful");
        
        // Update access token in localStorage
        localStorage.setItem('accessToken', response.data.access_token);
        
        // Update Authorization header with new token
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Add better logging to understand the refresh error
        console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
        
        // If refresh fails, clear all auth data and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Add request interceptor to always include the latest token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;