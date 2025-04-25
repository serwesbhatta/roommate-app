// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';
import { clearAuthStorage } from '../../utils/authUtils';

// ===================== Thunks =====================

export const loginUser = createAsyncThunk('user/login', async (credentials, thunkAPI) => {
  try {
    // Clear potential previous error state
    const modifiedCredentials = {
      msu_email: credentials.email,
      password: credentials.password,
    };
    const response = await authService.loginUserAPI(modifiedCredentials);

    // Store tokens and user info in localStorage
    localStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);
    localStorage.setItem('role', response.user.role);
    localStorage.setItem('id', response.user.id);
    localStorage.setItem('msu_email', response.user.msu_email);
    localStorage.setItem('is_logged_in', response.user.is_logged_in);
    localStorage.setItem('last_login', response.user.last_login);

    return { ...response, role: response.user.role };
  } catch (error) {
    // Ensure this error is properly formatted for display
    const errorMessage = error.response?.data?.detail || 'Login failed';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.registerUserService(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Registration failed');
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async ({ userId, userData }, thunkAPI) => {
  try {
    return await authService.updateUserService({ userId, userData });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'User update failed');
  }
});

export const deleteUser = createAsyncThunk('auth/deleteUser', async (userId, thunkAPI) => {
  try {
    return await authService.deleteUserService(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'User deletion failed');
  }
});

export const updateUserPassword = createAsyncThunk('auth/updatePassword', async ({ user_id, updateData }, thunkAPI) => {
  try {
    return await authService.updateUserPasswordService({ user_id, updateData });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Password update failed');
  }
});

export const fetchAllAuthUsers = createAsyncThunk('auth/fetchAllUsers', async ({ skip = 0, limit = 100 }, thunkAPI) => {
  try {
    return await authService.fetchAllAuthUsersService({ skip, limit });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Fetching auth users failed');
  }
});

export const fetchTotalAuthUsers = createAsyncThunk('auth/fetchTotalUsers', async (_, thunkAPI) => {
  try {
    return await authService.fetchTotalAuthUsersService();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Fetching total auth users failed');
  }
});

export const fetchNewUsers = createAsyncThunk('newUsers/fetchNewUsers', async ({ skip, limit }, thunkAPI) => {
  try {
    return await authService.fetchNewUsersService({ skip, limit });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');
    const response = await authService.refreshTokenService(refreshToken);
    localStorage.setItem('accessToken', response.access_token);
    return response;
  } catch (error) {
    clearAuthStorage();
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Token refresh failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try { await thunkAPI.dispatch(refreshToken()).unwrap(); } catch(_) {}
  await authService.logoutUserService();     // old implementation is fine now
  clearAuthStorage();
  return { success: true };
});

export const fetchAuthUserById = createAsyncThunk('auth/fetchAuthUserById', async (userId, thunkAPI) => {
  try {
    console.log("fetchAuthUserById",userId)
    return await authService.fetchAuthUserByIdService(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to fetch user by ID');
  }
});

// ===================== Slice =====================

const initialState = {
  access_token: localStorage.getItem('accessToken') || null,
  refresh_token: localStorage.getItem('refreshToken') || null,
  role: localStorage.getItem('role') || null,
  id: Number(localStorage.getItem('id')) || null,
  msu_email: localStorage.getItem('msu_email') || null,
  is_logged_in: localStorage.getItem('is_logged_in') || null,
  last_login: localStorage.getItem('last_login') || null,
  user: null,
  userById:null,
  allUsers: [],
  newUsers: [],
  totalUsers: 0,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      clearAuthStorage();
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.role = action.payload.user.role;
        state.id = action.payload.user.id;
        state.msu_email = action.payload.user.msu_email;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

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

      .addCase(fetchAuthUserById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAuthUserById.fulfilled, (state, action) => {
        state.userById = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAuthUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

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

      .addCase(fetchAllAuthUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTotalAuthUsers.fulfilled, (state, action) => {
        state.totalUsers = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchNewUsers.fulfilled, (state, action) => {
        state.newUsers = action.payload;
        state.status = 'succeeded';
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.access_token = action.payload.access_token;
        state.status = 'succeeded';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.status = 'succeeded';
        }
      );
  },
});

export default authSlice.reducer;
