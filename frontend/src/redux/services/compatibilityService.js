// src/services/compatibilityService.js
import axios from "axios";
import { API_ENDPOINTS } from "../../utils/api";

const getCompatibilityScore = (user1Id, user2Id) =>
  axios.get(API_ENDPOINTS.COMPATIBILITY_SCORE(user1Id, user2Id));

const getTopMatches = (userId, skip = 0, limit = 10) =>
  axios.get(API_ENDPOINTS.TOP_MATCHES(userId, skip, limit));

export default {
  getCompatibilityScore,
  getTopMatches,
};
