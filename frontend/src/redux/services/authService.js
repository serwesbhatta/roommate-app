import axios from 'axios';
import {login_api, register_api} from '../../utils/api'


export const loginUserAPI = async (credentials) => {
  console.log(login_api)
  const response = await axios.post(login_api, credentials);
  console.log(response)
  return response.data;
};

export const registerUserAPI = async (userData) => {
  const response = await axios.post(`${register_api}`, userData);
  return response.data;
};
