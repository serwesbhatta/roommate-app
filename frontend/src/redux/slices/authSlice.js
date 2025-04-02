import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserAPI } from '../services/authService';

/**
 * Async Thunk for logging in a user.
 * Calls the loginUserAPI function and handles success or failure.
 */
export const loginUser = createAsyncThunk('user/login', async (credentials, thunkAPI) => {
  try {
    const modifiedCredentials = {
      msu_email: credentials.email, // Change 'email' to 'msu_email'
      password: credentials.password,
    };
    const response = await loginUserAPI(modifiedCredentials);
    localStorage.setItem('token', response.access_token);  
    localStorage.setItem('role', response.user.role); 
    localStorage.setItem('id',response.user.id);
    localStorage.setItem('msu_email',response.user.msu_email);

    // Handle navigation based on role
    if (credentials.navigate) {
      const role = response.user.role;
      if (role === 'admin') {
        credentials.navigate('/admin');
      } else {
        credentials.navigate('/user');
      }
    }

    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Login failed');
  }
});

// User Slice - manages authentication state
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,  
    role: localStorage.getItem('role') || null,
    id: localStorage.getItem('id') || null,
    msu_email: localStorage.getItem('msu_email') || null,
    status: 'idle', 
    error: null, 
  },
  reducers: {
    /**
     * Logs out the user by clearing user data and authentication token.
     * Also removes the token from local storage.
     */
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.id = null;
      state.msu_email = null;
      state.status = 'idle';
      state.error = null
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      localStorage.removeItem('msu_email');
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
        state.token = action.payload.access_token;
        state.role = action.payload.user.role;
        state.id = action.payload.user.id;
        state.msu_email = action.payload.user.msu_email
      })
      .addCase(loginUser.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.payload; 
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
