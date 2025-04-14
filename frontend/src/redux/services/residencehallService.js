// services/accommodationService.js

import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

// Create a new accommodation (residence hall)
export const createResidenceHall = async (accommodationData) => {
  const response = await axios.post(API_ENDPOINTS.CREATE_RESIDENCE_HALL, accommodationData);
  return response.data;
};

// Get a single accommodation by ID
export const getResidenceHall = async (id) => {
  const response = await axios.get(API_ENDPOINTS.GET_RESIDENCE_HALL(id));
  return response.data;
};

// List accommodations with optional pagination (skip & limit)
export const listResidenceHall = async (skip = 0, limit = 100) => {
  const response = await axios.get(API_ENDPOINTS.LIST_RESIDENCE_HALLS, {
    params: { skip, limit },
  });
  return response.data;
};

// Update an accommodation
export const updateResidenceHall = async (id, updateData) => {
  console.log("updateResidenceHall", updateData)
  const response = await axios.put(API_ENDPOINTS.UPDATE_RESIDENCE_HALL(id), updateData);
  return response.data;
};

// Delete an accommodation
export const deleteResidenceHall= async (id) => {
  const response = await axios.delete(API_ENDPOINTS.DELETE_RESIDENCE_HALL(id));
  return response.data;
};

export const getTotalHalls = async () => {
  const response = await axios.get(API_ENDPOINTS.TOTAL_HALLS__COUNT);
  return response.data;
};


