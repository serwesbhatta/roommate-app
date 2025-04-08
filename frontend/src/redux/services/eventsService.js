// services/eventsService.js
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

const eventsService = {
  createEvent: async (data) => {
    const response = await axios.post(API_ENDPOINTS.CREATE_EVENT, data);
    return response.data;
  },

  getEvent: async (id) => {
    const response = await axios.get(API_ENDPOINTS.GET_EVENT(id));
    return response.data;
  },

  listEvents: async (params) => {
    const response = await axios.get(API_ENDPOINTS.LIST_EVENTS, { params });
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await axios.put(API_ENDPOINTS.UPDATE_EVENT(id), data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await axios.delete(API_ENDPOINTS.DELETE_EVENT(id));
    return response.data;
  },

  getTotalEvents: async () => {
    const response = await axios.get(API_ENDPOINTS.EVENTS_TOTAL_COUNT);
    return response.data;
  },

  getPendingEvents: async (params) => {
    const response = await axios.get(API_ENDPOINTS.PENDING_EVENTS, { params });
    return response.data;
  },

  getApprovedEvents: async (params) => {
    const response = await axios.get(API_ENDPOINTS.APPROVED_EVENTS, { params });
    return response.data;
  },
};

export default eventsService;
