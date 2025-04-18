// src/services/feedbackService.js
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

const feedbackService = {
  createFeedback: (feedbackData) =>
    axios.post(API_ENDPOINTS.CREATE_FEEDBACK, feedbackData),

  updateFeedback: (receiverUserId, feedbackData) =>
    axios.put(API_ENDPOINTS.UPDATE_FEEDBACK(receiverUserId), feedbackData),

  deleteFeedback: (receiverUserId, giverUserId) =>
    axios.delete(API_ENDPOINTS.DELETE_FEEDBACK(receiverUserId, giverUserId)),

  listFeedbackReceived: (receiverUserId, { skip = 0, limit = 100 } = {}) =>
    axios.get(API_ENDPOINTS.LIST_FEEDBACK_RECEIVED(receiverUserId), {
      params: { skip, limit }
    }),

  listFeedbackGave: (giverUserId, { skip = 0, limit = 100 } = {}) =>
    axios.get(API_ENDPOINTS.LIST_FEEDBACK_GAVE(giverUserId), {
      params: { skip, limit }
    }),

  getAverageRating: (userId) =>
    axios.get(API_ENDPOINTS.AVERAGE_RATING(userId)),

  hasGivenFeedback: (receiverUserId, giverUserId) =>
    axios.get(API_ENDPOINTS.HAS_GIVEN_FEEDBACK(receiverUserId, giverUserId)),
};

export default feedbackService;