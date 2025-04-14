// slices/residenceHallSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as residenceHallService from '../../redux/services/residencehallService';

// Async thunk for fetching a list of residence halls
export const fetchResidenceHalls = createAsyncThunk(
  'residenceHall/fetchResidenceHalls',
  async ({ skip, limit }, { rejectWithValue }) => {
    try {
      const data = await residenceHallService.listResidenceHall(skip, limit);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for fetching a single residence hall
export const fetchResidenceHall = createAsyncThunk(
  'residenceHall/fetchResidenceHall',
  async (id, { rejectWithValue }) => {
    try {
      const data = await residenceHallService.getResidenceHall(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for creating a new residence hall
export const createResidenceHall = createAsyncThunk(
  'residenceHall/createResidenceHall',
  async (residenceHallData, { rejectWithValue }) => {
    try {
      const data = await residenceHallService.createResidenceHall(residenceHallData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for updating an existing residence hall
export const updateResidenceHall = createAsyncThunk(
  'residenceHall/updateResidenceHall',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const temp = await residenceHallService.updateResidenceHall(id, data);
      return temp;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for deleting a residence hall
export const deleteResidenceHall = createAsyncThunk(
  'residenceHall/deleteResidenceHall',
  async (id, { rejectWithValue }) => {
    try {
      const data = await residenceHallService.deleteResidenceHall(id);
      return { id, data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for getting total rooms count
export const fetchTotalHalls = createAsyncThunk(
  'rooms/fetchTotalHalls',
  async (_, { rejectWithValue }) => {
    try {
      const data = await residenceHallService.getTotalHalls();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const residenceHallSlice = createSlice({
  name: 'residenceHall',
  initialState: {
    residenceHalls: [],
    currentResidenceHall: null,
    totalHalls: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Optional synchronous reducers can be added here
    clearCurrentResidenceHall(state) {
      state.currentResidenceHall = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list of residence halls
      .addCase(fetchResidenceHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidenceHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.residenceHalls = action.payload;
      })
      .addCase(fetchResidenceHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch a single residence hall
      .addCase(fetchResidenceHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidenceHall.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResidenceHall = action.payload;
      })
      .addCase(fetchResidenceHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create a new residence hall
      .addCase(createResidenceHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResidenceHall.fulfilled, (state, action) => {
        state.loading = false;
        state.residenceHalls.push(action.payload);
      })
      .addCase(createResidenceHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update an existing residence hall
      .addCase(updateResidenceHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResidenceHall.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.residenceHalls = state.residenceHalls.map((item) =>
          item.id === updated.id ? updated : item
        );
        if (state.currentResidenceHall && state.currentResidenceHall.id === updated.id) {
          state.currentResidenceHall = updated;
        }
      })
      .addCase(updateResidenceHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Total rooms
      .addCase(fetchTotalHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.totalHalls = action.payload;
      })
      .addCase(fetchTotalHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete a residence hall
      .addCase(deleteResidenceHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResidenceHall.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.residenceHalls = state.residenceHalls.filter((item) => item.id !== id);
        if (state.currentResidenceHall && state.currentResidenceHall.id === id) {
          state.currentResidenceHall = null;
        }
      })
      .addCase(deleteResidenceHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentResidenceHall } = residenceHallSlice.actions;
export default residenceHallSlice.reducer;
