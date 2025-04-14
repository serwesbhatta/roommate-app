//store/index.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import eventsReducer from '../slices/eventsSlice';
import questionnaireReducer from '../slices/questionnaireSlice';
import residenceHallReducer from '../slices/residenceHallSlice';
import roomReducer from '../slices/roomSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    events: eventsReducer,
    questionnaire: questionnaireReducer,
    residenceHall: residenceHallReducer,
    rooms: roomReducer,
  },
});

