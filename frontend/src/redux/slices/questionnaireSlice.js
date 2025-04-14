import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchQuestionOptionsList,
  fetchQuestionOptionsById,
  submitUserResponses,
  fetchUserResponses,
  updateUserResponses,
} from '../services/questionnaireService';

export const getQuestionOptionsById = createAsyncThunk('questionnaire/getQuestionById', async (questionId, thunkAPI) => {
    try {
        return await fetchQuestionOptionsById(questionId);
    }  catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const getQuestionOptionsList = createAsyncThunk(
    'questionnaire/getQuestionList',
    async ({ skip = 0, limit = 100 }, thunkAPI) => {
      try {
        const data = await fetchQuestionOptionsList(skip, limit);
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to fetch questions');
      }
    }
  );
  
  export const postUserResponses = createAsyncThunk(
    'questionnaire/postUserResponses',
    async ({ userProfileId, responses }, thunkAPI) => {
      try {
        const data = await submitUserResponses(userProfileId, responses);
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to submit responses');
      }
    }
  );

  export const getUserResponses = createAsyncThunk('questionnaire/getUserResponses', async (userProfileId, thunkAPI) => {
    try {
      return await fetchUserResponses(userProfileId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to fetch user responses');
    }
  });
  

  export const putUserResponses = createAsyncThunk('questionnaire/putUserResponses', async ({ userProfileId, responses }, thunkAPI) => {
    try {
      return await updateUserResponses(userProfileId, responses);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Failed to update responses');
    }
  });
  

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState: {
    questions: [],
    currentQuestion: null,
    userResponses: {},
    responseStatus: 'idle',
    responseError: null,
    fetchStatus: 'idle',
    fetchError: null,
    loadUserResponsesStatus: 'idle',
    loadUserResponsesError: null,
    updateUserResponsesStatus: 'idle',
    updateUserResponsesError: null,
  },
  reducers: {
    setUserResponse: (state, action) => {
      const { questionId, selectedOption } = action.payload;
      state.userResponses[questionId] = selectedOption;
    },
    resetUserResponses: (state) => {
      state.userResponses = {};
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getQuestionOptionsList.pending, (state) => {
      state.fetchStatus = 'loading';
    })
    .addCase(getQuestionOptionsList.fulfilled, (state, action) => {
      state.fetchStatus = 'succeeded';
      state.questions = action.payload;
    })
    .addCase(getQuestionOptionsList.rejected, (state, action) => {
      state.fetchStatus = 'failed';
      state.fetchError = action.error.message;
    })

    // Fetch single question
    .addCase(getQuestionOptionsById.fulfilled, (state, action) => {
      state.currentQuestion = action.payload;
    })

    // Submit new user responses
    .addCase(postUserResponses.pending, (state) => {
      state.responseStatus = 'loading';
    })
    .addCase(postUserResponses.fulfilled, (state) => {
      state.responseStatus = 'succeeded';
    })
    .addCase(postUserResponses.rejected, (state, action) => {
      state.responseStatus = 'failed';
      state.responseError = action.error.message;
    })

    // ⬇️ Get user responses
    .addCase(getUserResponses.pending, (state) => {
      state.loadUserResponsesStatus = 'loading';
    })
    .addCase(getUserResponses.fulfilled, (state, action) => {
      state.loadUserResponsesStatus = 'succeeded';
      state.userResponses = {};

      // Convert array into { questionId: selectedOption }
      action.payload.forEach(resp => {
        state.userResponses[resp.question_id] = resp.selected_option;
      });
    })
    .addCase(getUserResponses.rejected, (state, action) => {
      state.loadUserResponsesStatus = 'failed';
      state.loadUserResponsesError = action.payload;
    })

    .addCase(putUserResponses.pending, (state) => {
      state.updateUserResponsesStatus = 'loading';
    })
    .addCase(putUserResponses.fulfilled, (state, action) => {
      state.updateUserResponsesStatus = 'succeeded';
    })
    .addCase(putUserResponses.rejected, (state, action) => {
      state.updateUserResponsesStatus = 'failed';
      state.updateUserResponsesError = action.payload;
    });
  },
});

export const { setUserResponse, resetUserResponses } = questionnaireSlice.actions;
export default questionnaireSlice.reducer;
