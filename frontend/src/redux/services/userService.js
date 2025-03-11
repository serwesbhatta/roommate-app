import axios from 'axios';

const API_URL = 'http://localhost:8000/api/user';

export const fetchUserProfileAPI = async () => {
  const response = await axios.get(`${API_URL}/user`);
  return response.data;
};


