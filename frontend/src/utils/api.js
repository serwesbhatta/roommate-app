// utils/api.js
const BASE_URL = "http://localhost:8000/api";

export const API_ENDPOINTS = {
  BASE_URL,

  // ─── Authentication ─────────────────────────────
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/admin_users`,
  UPDATE_USER: (id) => `${BASE_URL}/admin_users/${id}`,
  DELETE_USER: (id) => `${BASE_URL}/admin_users/${id}`,
  FETCH_ALL_AUTH_USERS: `${BASE_URL}/admin_users/all`,
  FETCH_TOTAL_AUTH_USERS: `${BASE_URL}/admin_users/total`,
  UPDATE_PASSWORD: (id) => `${BASE_URL}/users/update_password/${id}`,
  NEW_USERS: `${BASE_URL}/admin_users/new`,

  // ─── USER PROFILE ─────────────────────────────
  GET_PROFILE: `${BASE_URL}/profile`,
  UPDATE_PROFILE: `${BASE_URL}/profile`,
  GET_ALL_PROFILES: `${BASE_URL}/profiles/all`,
  GET_TOTAL_PROFILES: `${BASE_URL}/profiles/total`,

  // ─── Events ─────────────────────────────────────
  CREATE_EVENT: `${BASE_URL}/events`,
  GET_EVENT: (id) => `${BASE_URL}/events/${id}`,
  LIST_EVENTS: `${BASE_URL}/events`,
  UPDATE_EVENT: (id) => `${BASE_URL}/events/${id}`,
  DELETE_EVENT: (id) => `${BASE_URL}/events/${id}`,
  EVENTS_TOTAL_COUNT: `${BASE_URL}/events_total_count`,
  PENDING_EVENTS: `${BASE_URL}/events_pending`,
  APPROVED_EVENTS: `${BASE_URL}/events_approved`,

  // ─── Questionnaire: Questions + Options ─────────
  GET_QUESTION_WITH_OPTIONS: (questionId) => `${BASE_URL}/question_options?question_id=${questionId}`,
  LIST_QUESTIONS_WITH_OPTIONS: `${BASE_URL}/questions_options_list`,

  // ─── Questionnaire: User Responses ──────────────
  USER_RESPONSES: (userProfileId) => `${BASE_URL}/user-responses/${userProfileId}`,

  // ─── Accommodations (Residence Halls) ─────────────
  CREATE_RESIDENCE_HALL: `${BASE_URL}/residence-halls`,
  GET_RESIDENCE_HALL: (id) => `${BASE_URL}/residence-halls/${id}`,
  LIST_RESIDENCE_HALLS: `${BASE_URL}/residence-halls`,
  UPDATE_RESIDENCE_HALL: (id) => `${BASE_URL}/residence-halls/${id}`,
  DELETE_RESIDENCE_HALL: (id) => `${BASE_URL}/residence-halls/${id}`,
  TOTAL_HALLS__COUNT: `${BASE_URL}/residence-halls/count`,

  // ─── Rooms ───────────────────────────────────────
  CREATE_ROOM: `${BASE_URL}/rooms`,
  GET_ROOM: (residenceHallId, roomNumber) =>`${BASE_URL}/rooms/${residenceHallId}/${roomNumber}`,
  LIST_ROOMS: `${BASE_URL}/rooms`,
  UPDATE_ROOM: (residenceHallId, roomNumber) =>`${BASE_URL}/rooms/${residenceHallId}/${roomNumber}`,
  DELETE_ROOM: (residenceHallId, roomNumber) =>`${BASE_URL}/rooms/${residenceHallId}/${roomNumber}`,
  TOTAL_ROOMS: `${BASE_URL}/rooms_total_count`,
  AVAILABLE_ROOMS: `${BASE_URL}/rooms_available_count`,
  ALLOCATE_STUDENTS: (residence_hall_id,room_number) =>`${BASE_URL}/rooms/${residence_hall_id}/${room_number}/allocate`,
  VACATE_ROOM: (residence_hall_id, room_number) =>`${BASE_URL}/rooms/${residence_hall_id}/${room_number}/vacate`,

};
