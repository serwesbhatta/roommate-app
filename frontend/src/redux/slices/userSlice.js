import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserAPI, registerUserAPI } from '../services/userService';

/**
 * Async Thunk for logging in a user.
 * Calls the loginUserAPI function and handles success or failure.
 */
export const loginUser = createAsyncThunk('user/login', async (credentials, thunkAPI) => {
  try {
    const response = await loginUserAPI(credentials);
    localStorage.setItem('token', response.token);  
    localStorage.setItem('role', response.user.role); 
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

/**
 * Async Thunk for registering a new user.
 * Calls the registerUserAPI function and handles success or failure.
 */
export const registerUser = createAsyncThunk('user/register', async (userData, thunkAPI) => {
  try {
    return await registerUserAPI(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

// User Slice - manages authentication state
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,   // Stores the authenticated user's data
    token: localStorage.getItem('token') || null,  // Stores the authentication token
    role: localStorage.getItem('role') || null,
    status: 'idle', // Tracks request status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,  // Stores error messages if any API call fails
  },
  reducers: {
    /**
     * Logs out the user by clearing user data and authentication token.
     * Also removes the token from local storage.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      // Handles login state changes
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
      })

      // Handles register state changes
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
