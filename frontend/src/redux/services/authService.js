import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';



export const loginUserAPI = async (credentials) => {
  const response = await axios.post(API_ENDPOINTS.LOGIN, credentials);
  return response.data;
};


