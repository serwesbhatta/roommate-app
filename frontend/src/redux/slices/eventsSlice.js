// slices/eventsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventsService from '../services/eventsService';

const initialState = {
  events: [],
  approvedEvents: [],
  pendingEvents: [],
  selectedEvent: null,
  totalCount: 0,
  loading: false,
  error: null,
};

// Thunks
export const fetchEvents = createAsyncThunk('events/fetch', async (params, thunkAPI) => {
  try {
    return await eventsService.listEvents(params);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchEventById = createAsyncThunk('events/fetchOne', async (id, thunkAPI) => {
  try {
    return await eventsService.getEvent(id);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const createEvent = createAsyncThunk('events/create', async (data, thunkAPI) => {
  try {
    return await eventsService.createEvent(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateEvent = createAsyncThunk('events/update', async ({ id, data }, thunkAPI) => {
  console.log("id",id)
  console.log("data",data)
  try {
    return await eventsService.updateEvent(id, data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data.detail || err.message);
  }
});

export const deleteEvent = createAsyncThunk('events/delete', async (id, thunkAPI) => {
  try {
    await eventsService.deleteEvent(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchTotalEventCount = createAsyncThunk('events/totalCount', async (_, thunkAPI) => {
  try {
    return await eventsService.getTotalEvents();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchPendingEvents = createAsyncThunk('events/pending', async (params, thunkAPI) => {
  try {
    return await eventsService.getPendingEvents(params);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchApprovedEvents = createAsyncThunk('events/approved', async (params, thunkAPI) => {
  try {
    return await eventsService.getApprovedEvents(params);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});


// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetEventsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchApprovedEvents.fulfilled, (state, action) => {
        state.approvedEvents = action.payload;
        state.loading = false;
      })
      .addCase(fetchPendingEvents.fulfilled, (state, action) => {
        state.pendingEvents = action.payload;
        state.loading = false;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
        state.loading = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
        state.loading = false;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const idx = state.events.findIndex(e => e.id === action.payload.id);
        if (idx !== -1) state.events[idx] = action.payload;
        state.loading = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload);
        state.loading = false;
      })
      .addCase(fetchTotalEventCount.fulfilled, (state, action) => {
        state.totalCount = action.payload;
        state.loading = false;
      })

      // Handle pending and error
      .addMatcher((action) => action.type.startsWith('events/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('events/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetEventsState } = eventsSlice.actions;
export default eventsSlice.reducer;
