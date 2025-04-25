// src/redux/slices/compatibilitySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import compatibilityService from "../../redux/services/compatibilityService";

// ─── Thunks ─────────────────────────────────────────

// Fetch the rounded score between two specific users
export const fetchCompatibilityScore = createAsyncThunk(
  "compatibility/fetchScore",
  async ({ user1Id, user2Id }, { rejectWithValue }) => {
    try {
      const { data } = await compatibilityService.getCompatibilityScore(
        user1Id,
        user2Id
      );
      // data: { user1_id, user2_id, compatibility_score }
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || err.message || "Failed to load score"
      );
    }
  }
);

// Fetch top‑N matches for a user, including their profile
export const fetchTopMatches = createAsyncThunk(
  "compatibility/fetchTopMatches",
  async ({ userId, skip = 0,  limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await compatibilityService.getTopMatches(userId, skip, limit);
      return data.matches;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || err.message || "Failed to load matches"
      );
    }
  }
);

// ─── Slice ──────────────────────────────────────────

const compatibilitySlice = createSlice({
  name: "compatibility",
  initialState: {
    score: null,        // { user1_id, user2_id, compatibility_score }
    topMatches: [],     // [ { user_id, compatibility_score, profile: UserProfileResponse } ]
    loading: false,
    error: null,
  },
  reducers: {
    clearCompatibility(state) {
      state.score = null;
      state.topMatches = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // -- score
    builder
      .addCase(fetchCompatibilityScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompatibilityScore.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.score = payload;
      })
      .addCase(fetchCompatibilityScore.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // -- topMatches
    builder
      .addCase(fetchTopMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopMatches.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.topMatches = payload;
      })
      .addCase(fetchTopMatches.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearCompatibility } = compatibilitySlice.actions;
export default compatibilitySlice.reducer;
