// slices/roomSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as roomService from '../../redux/services/roomService';

// Async thunk for listing rooms
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async ({ skip, limit }, { rejectWithValue }) => {
    try {
      const data = await roomService.listRooms(skip, limit);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for getting a single room
export const fetchRoom = createAsyncThunk(
  'rooms/fetchRoom',
  async ({ residenceHallId, roomNumber }, { rejectWithValue }) => {
    try {
      const data = await roomService.getRoom(residenceHallId, roomNumber);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for creating a room
export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const data = await roomService.createRoom(roomData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for updating a room
export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ residenceHallId, roomNumber, updateData }, { rejectWithValue }) => {
    try {
      const data = await roomService.updateRoom(residenceHallId, roomNumber, updateData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for deleting a room
export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async ({ residenceHallId, roomNumber }, { rejectWithValue }) => {
    try {
      const data = await roomService.deleteRoom(residenceHallId, roomNumber);
      return { residenceHallId, roomNumber, data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for getting total rooms count
export const fetchTotalRooms = createAsyncThunk(
  'rooms/fetchTotalRooms',
  async (_, { rejectWithValue }) => {
    try {
      const data = await roomService.getTotalRooms();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for getting available rooms count
export const fetchAvailableRooms = createAsyncThunk(
  'rooms/fetchAvailableRooms',
  async (_, { rejectWithValue }) => {
    try {
      const data = await roomService.getAvailableRooms();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for allocating students to a room
export const allocateStudents = createAsyncThunk(
  'rooms/allocateStudents',
  async ({ residence_hall_id, room_number, student_ids }, { rejectWithValue }) => {
    try {
      const data = await roomService.allocateStudentsToRoom(residence_hall_id, room_number, student_ids );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for vacating a room
export const vacateRoom = createAsyncThunk(        
  'rooms/vacateRoom',
  async ({ residence_hall_id, room_number, student_ids }, { rejectWithValue }) => {
    try {
      const data = await roomService.vacateRoom(residence_hall_id, room_number, student_ids );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    roomList: [],
    currentRoom: null,
    totalRooms: 0,
    availableRooms: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentRoom(state) {
      state.currentRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list of rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.roomList = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single room
      .addCase(fetchRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create room
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.roomList.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.roomList = state.roomList.map((room) =>
          room.room_number === updated.room_number &&
          room.residence_hall_id === updated.residence_hall_id
            ? updated
            : room
        );
        if (
          state.currentRoom &&
          state.currentRoom.room_number === updated.room_number &&
          state.currentRoom.residence_hall_id === updated.residence_hall_id
        ) {
          state.currentRoom = updated;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete room
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        const { residenceHallId, roomNumber } = action.payload;
        state.roomList = state.roomList.filter(
          (room) =>
            !(room.room_number === roomNumber &&
              room.residence_hall_id === residenceHallId)
        );
        if (
          state.currentRoom &&
          state.currentRoom.room_number === roomNumber &&
          state.currentRoom.residence_hall_id === residenceHallId
        ) {
          state.currentRoom = null;
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Total rooms
      .addCase(fetchTotalRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.totalRooms = action.payload;
      })
      .addCase(fetchTotalRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Available rooms
      .addCase(fetchAvailableRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRooms = action.payload;
      })
      .addCase(fetchAvailableRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Allocate students to room
      .addCase(allocateStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allocateStudents.fulfilled, (state, action) => {
        state.loading = false;
        // Assume the updated room object is returned
        state.currentRoom = action.payload;
        // Optionally update the room list if needed
      })
      .addCase(allocateStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vacate room
      .addCase(vacateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vacateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
        // Optionally update the room list if needed
      })
      .addCase(vacateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;
