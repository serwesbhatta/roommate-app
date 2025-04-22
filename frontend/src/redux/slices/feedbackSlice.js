// src/redux/slices/feedbackSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feedbackService from '../services/feedbackService';

const initialState = {
  received: [],
  gave: [],
  averageRating: 0,
  hasGiven: false,
  loading: false,
  error: null,
};

export const fetchFeedbackReceived = createAsyncThunk(
  'feedback/fetchReceived',
  async ({ userId, skip, limit }, thunkAPI) => {
    try {
      const { data } = await feedbackService.listFeedbackReceived(userId, { skip, limit });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFeedbackGave = createAsyncThunk(
  'feedback/fetchGave',
  async ({ userId, skip, limit }, thunkAPI) => {
    try {
      const { data } = await feedbackService.listFeedbackGave(userId, { skip, limit });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/create',
  async (payload, thunkAPI) => {
    try {
      const { data } = await feedbackService.createFeedback(payload);
      console.log("createFeedback",data)
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateFeedback = createAsyncThunk(
  'feedback/update',
  async ({ receiverUserId, feedbackData }, thunkAPI) => {
    try {
      console.log("service_update_feedback_id--> ",receiverUserId)
      console.log("service_update_feedback_data--> ",feedbackData)
      const { data } = await feedbackService.updateFeedback(receiverUserId, feedbackData);
      console.log("updateFeedback",data)
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/delete',
  async ({ receiverUserId, giverUserId }, thunkAPI) => {
    try {
      await feedbackService.deleteFeedback(receiverUserId, giverUserId);
      return { receiverUserId, giverUserId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAverageRating = createAsyncThunk(
  'feedback/fetchAverageRating',
  async (userId, thunkAPI) => {
    try {
      const { data } = await feedbackService.getAverageRating(userId);
      console.log("fetchAverageRating",data)
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const checkHasGiven = createAsyncThunk(
  'feedback/checkHasGiven',
  async ({ receiverUserId, giverUserId }, thunkAPI) => {
    try {
      const { data } = await feedbackService.hasGivenFeedback(receiverUserId, giverUserId);
      console.log("checkHasGiven",data)
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);


const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch received
      .addCase(fetchFeedbackReceived.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackReceived.fulfilled, (state, action) => {
        state.loading = false;
        state.received = action.payload;
      })
      .addCase(fetchFeedbackReceived.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch gave
      .addCase(fetchFeedbackGave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackGave.fulfilled, (state, action) => {
        state.loading = false;
        state.gave = action.payload;
      })
      .addCase(fetchFeedbackGave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.gave.push(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update
      .addCase(updateFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.gave = state.gave.map(f =>
          f.id === action.payload.id ? action.payload : f
        );
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete
      .addCase(deleteFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const { receiverUserId, giverUserId } = action.payload;
        state.gave = state.gave.filter(
          f => !(f.receiver_user_id === receiverUserId && f.giver_user_id === giverUserId)
        );
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // average rating
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        state.averageRating = action.payload;
      })
      .addCase(fetchAverageRating.rejected, (state, action) => {
        state.error = action.payload;
      })

      // has given
      .addCase(checkHasGiven.fulfilled, (state, action) => {
        state.hasGiven = action.payload;
      })
      .addCase(checkHasGiven.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default feedbackSlice.reducer;