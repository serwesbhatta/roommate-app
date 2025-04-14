// services/roomService.js
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

// Create a new room
export const createRoom = async (roomData) => {
  const response = await axios.post(API_ENDPOINTS.CREATE_ROOM, roomData);
  return response.data;
};

// Get a room by residence hall id and room number
export const getRoom = async (residenceHallId, roomNumber) => {
  const response = await axios.get(API_ENDPOINTS.GET_ROOM(residenceHallId, roomNumber));
  return response.data;
};

// List rooms with pagination (skip & limit)
export const listRooms = async (skip = 0, limit = 100) => {
  const response = await axios.get(API_ENDPOINTS.LIST_ROOMS, {
    params: { skip, limit },
  });
  return response.data;
};

// Update a room
export const updateRoom = async (residenceHallId, roomNumber, updateData) => {
  const response = await axios.put(
    API_ENDPOINTS.UPDATE_ROOM(residenceHallId, roomNumber),
    updateData
  );
  return response.data;
};

// Delete a room
export const deleteRoom = async (residenceHallId, roomNumber) => {
  const response = await axios.delete(
    API_ENDPOINTS.DELETE_ROOM(residenceHallId, roomNumber)
  );
  return response.data;
};

// Get total count of rooms
export const getTotalRooms = async () => {
  const response = await axios.get(API_ENDPOINTS.TOTAL_ROOMS);
  return response.data;
};

// Get count of available rooms
export const getAvailableRooms = async () => {
  const response = await axios.get(API_ENDPOINTS.AVAILABLE_ROOMS);
  return response.data;
};

// Allocate students to a room
// Note: residenceHallId is sent as a query parameter.
export const allocateStudentsToRoom = async (residence_hall_id, room_number, student_ids ) => {
  const response = await axios.post(
    API_ENDPOINTS.ALLOCATE_STUDENTS(residence_hall_id,room_number),
    { student_ids: student_ids }
  );
  return response.data;
};

// Vacate room: remove one or more students from a room
export const vacateRoom = async (residence_hall_id, room_number, student_ids ) => {
  const response = await axios.post(
    API_ENDPOINTS.VACATE_ROOM(residence_hall_id, room_number),
    { student_ids: student_ids }
  );
  return response.data;
};
