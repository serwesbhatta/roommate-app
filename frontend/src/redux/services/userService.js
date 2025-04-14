// services/profileService.js
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

export const fetchUserProfileService = async (userId) => {
  const response = await axios.get(`${API_ENDPOINTS.GET_PROFILE}?user_id=${userId}`);
  return response.data;
};

export const updateUserProfileService = async ({ userId, profileData }) => {
  const response = await axios.put(
    `${API_ENDPOINTS.UPDATE_PROFILE}?user_id=${userId}`,
    profileData, 
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const fetchAllUserProfilesService = async ({ skip = 0, limit = 100 }) => {
  const response = await axios.get(
    `${API_ENDPOINTS.GET_ALL_PROFILES}?skip=${skip}&limit=${limit}`
  );
  return response.data;
};

export const fetchTotalUserProfilesService = async () => {
  const response = await axios.get(API_ENDPOINTS.GET_TOTAL_PROFILES);
  return response.data;
};
