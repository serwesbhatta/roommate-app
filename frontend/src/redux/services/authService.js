import axios from 'axios';
import {login_api} from '../../utils/api'


export const loginUserAPI = async (credentials) => {
  const response = await axios.post(login_api, credentials);
  return response.data;
};


