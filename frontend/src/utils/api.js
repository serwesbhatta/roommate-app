// utils/api.js
const BASE_URL = "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // Authentication endpoint
  LOGIN: `${BASE_URL}/login`,

  // Events endpoints
  CREATE_EVENT: `${BASE_URL}/events`,
  GET_EVENT: (id) => `${BASE_URL}/events/${id}`,
  LIST_EVENTS: `${BASE_URL}/events`,
  UPDATE_EVENT: (id) => `${BASE_URL}/events/${id}`,
  DELETE_EVENT: (id) => `${BASE_URL}/events/${id}`,
  EVENTS_TOTAL_COUNT: `${BASE_URL}/events_total_count`,
  PENDING_EVENTS: `${BASE_URL}/events_pending`,
  APPROVED_EVENTS: `${BASE_URL}/events_approved`,
};
