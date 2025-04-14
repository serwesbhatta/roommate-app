import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

export const fetchQuestionOptionsList = async (skip = 0, limit = 100) => {
  const response = await axios.get(`${API_ENDPOINTS.LIST_QUESTIONS_WITH_OPTIONS}?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const fetchQuestionOptionsById = async (questionId) => {
  const response = await axios.get(API_ENDPOINTS.GET_QUESTION_WITH_OPTIONS(questionId));
  return response.data;
};

export const submitUserResponses = async (userProfileId, responses) => {
  const response = await axios.post(API_ENDPOINTS.USER_RESPONSES(userProfileId), responses);
  return response.data;
};

export const fetchUserResponses = async (userProfileId) => {
  const response = await axios.get(API_ENDPOINTS.USER_RESPONSES(userProfileId)); 
  return response.data;
};

export const updateUserResponses = async (userProfileId, responses) => {
  const response = await axios.put(API_ENDPOINTS.USER_RESPONSES(userProfileId), responses);
  return response.data;
};