import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import api from '../middlewares/axiosSetup';

export const loginUserAPI = async (credentials) => {
  // Format data as FormData for OAuth2PasswordRequestForm compatibility
  const formData = new FormData();
  formData.append('username', credentials.msu_email); 
  formData.append('password', credentials.password);
  
  const response = await axios.post(API_ENDPOINTS.LOGIN, formData);
  return response.data;
};

export const registerUserService = async (userData) => {
  const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
  return response.data;
};

export const updateUserService = async ({ userId, userData }) => {
  const response = await axios.put(API_ENDPOINTS.UPDATE_USER(userId), userData);
  return response.data;
};

export const deleteUserService = async (userId) => {
  const response = await axios.delete(API_ENDPOINTS.DELETE_USER(userId));
  return response.data;
};

export const updateUserPasswordService = async ({ user_id, updateData }) => {
  const response = await axios.put(API_ENDPOINTS.UPDATE_PASSWORD(user_id), updateData);
  return response.data;
};

export const fetchAllAuthUsersService = async ({ skip = 0, limit = 100 }) => {
  const response = await axios.get(
    `${API_ENDPOINTS.FETCH_ALL_AUTH_USERS}?skip=${skip}&limit=${limit}`
  );
  return response.data;
};

export const fetchTotalAuthUsersService = async () => {
  const response = await axios.get(API_ENDPOINTS.FETCH_TOTAL_AUTH_USERS);
  return response.data;
};

export const fetchNewUsersService = async ({ skip = 0, limit = 10 }) => {
  const response = await axios.get(`${API_ENDPOINTS.NEW_USERS}?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const refreshTokenService = async (refreshToken) => {
  const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, { refresh_token: refreshToken });
  return response.data;
};

export const logoutUserService = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      await axios.post(API_ENDPOINTS.LOGOUT, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
    }
    return { success: true };
  } catch (error) {
    console.warn('Server logout failed:', error.message);
    return { success: true };
  }
};


export const fetchAuthUserByIdService = async (userId) => {
  const response = await axios.get(API_ENDPOINTS.GET_AUTH_USER_BY_ID(userId));
  return response.data;
};
