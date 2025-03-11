import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfileAPI } from '../services/userService';

/**
 * Fetches user profile data from the API.
 */
export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, thunkAPI) => {
  try {
    return await fetchUserProfileAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
