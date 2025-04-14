// redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as profileService from '../services/userService';

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, thunkAPI) => {
    try {
      return await profileService.fetchUserProfileService(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Fetching profile failed'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, profileData }, thunkAPI) => {
    try {
      return await profileService.updateUserProfileService({ userId, profileData });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Profile update failed'
      );
    }
  }
);

export const fetchAllUserProfiles = createAsyncThunk(
  'profile/fetchAllProfiles',
  async ({ skip = 0, limit = 100 }, thunkAPI) => {
    try {
      return await profileService.fetchAllUserProfilesService({ skip, limit });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Fetching all profiles failed'
      );
    }
  }
);

export const fetchTotalUserProfiles = createAsyncThunk(
  'profile/fetchTotalProfiles',
  async (_, thunkAPI) => {
    try {
      return await profileService.fetchTotalUserProfilesService();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Fetching total profiles failed'
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    profiles: [],
    totalProfiles: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch current profile handlers
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update profile handlers
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch all profiles handlers
      .addCase(fetchAllUserProfiles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllUserProfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profiles = action.payload;
      })
      .addCase(fetchAllUserProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch total profiles handlers
      .addCase(fetchTotalUserProfiles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTotalUserProfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalProfiles = action.payload;
      })
      .addCase(fetchTotalUserProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
