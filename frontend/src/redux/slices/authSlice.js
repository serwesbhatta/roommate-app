//authSlice

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';
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
    const response = await authService.loginUserAPI(modifiedCredentials);
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


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.registerUserService(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Registration failed'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ userId, userData }, thunkAPI) => {
    try {
      return await authService.updateUserService({ userId, userData });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'User update failed'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (userId, thunkAPI) => {
    try {
      return await authService.deleteUserService(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'User deletion failed'
      );
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ user_id, updateData }, thunkAPI) => {
    try {
      return await authService.updateUserPasswordService({ user_id, updateData });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Password update failed'
      );
    }
  }
);

export const fetchAllAuthUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async ({ skip = 0, limit = 100 }, thunkAPI) => {
    try {
      return await authService.fetchAllAuthUsersService({ skip, limit });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Fetching auth users failed'
      );
    }
  }
);

export const fetchTotalAuthUsers = createAsyncThunk(
  'auth/fetchTotalUsers',
  async (_, thunkAPI) => {
    try {
      return await authService.fetchTotalAuthUsersService();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Fetching total auth users failed'
      );
    }
  }
);

export const fetchNewUsers = createAsyncThunk(
  'newUsers/fetchNewUsers',
  async ({ skip, limit }, thunkAPI) => {
    try {
      return await authService.fetchNewUsersService({ skip, limit });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    id: localStorage.getItem('id') || null,
    msu_email: localStorage.getItem('msu_email') || null,
    user: null,
    allUsers: [],
    newUsers:[],
    totalUsers: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.id = null;
      state.msu_email = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      localStorage.removeItem('msu_email');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login handlers
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.access_token;
        state.role = action.payload.user.role;
        state.id = action.payload.user.id;
        state.msu_email = action.payload.user.msu_email;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Registration handlers
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update user handlers
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete user handlers
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update password handlers
      .addCase(updateUserPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch all auth users handlers
      .addCase(fetchAllAuthUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllAuthUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allUsers = action.payload;
      })
      .addCase(fetchAllAuthUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch total auth users handlers
      .addCase(fetchTotalAuthUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTotalAuthUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalUsers = action.payload;
      })
      .addCase(fetchTotalAuthUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchNewUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newUsers = action.payload;
      })
      .addCase(fetchNewUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;