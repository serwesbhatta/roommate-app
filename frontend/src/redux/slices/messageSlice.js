
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../services/messageService';

// Initial state
const initialState = {
  myUserId:null,
  chatHistory: [],
  contacts: [],
  isLoading: false,
  activeChat: null,
  wsConnected: false,
  error: null
};

// Async thunks
export const fetchChatHistory = createAsyncThunk(
  'messages/fetchChatHistory',
  async ({ currentUserId, otherUserId, skip = 0, limit = 100 }, { rejectWithValue }) => {
    try {
      return await messageService.getChatHistory(currentUserId, otherUserId, skip, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chat history');
    }
  }
);

export const fetchContacts = createAsyncThunk(
  'messages/fetchContacts',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const contacts = await messageService.getChatContacts(userId);
      // Sync the contacts statuses separately after fetching
      dispatch(syncContactStatuses(contacts));
      return contacts;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch contacts');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiverId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const message = {
        receiver_id: receiverId,
        content
      };
      return await messageService.sendMessage(message);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to send message');
    }
  }
);

export const syncContactStatuses = createAsyncThunk(
  'messages/syncContactStatuses',
  async (contacts, { dispatch }) => {
    return contacts;
  }
);

// Message slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {

    setMyUserId(state, { payload }) {
      state.myUserId = payload;
    },

    addMessage: (state, action) => {
      // Check if this is a confirmed message replacing a temporary one
      const isConfirmedMessage = action.payload.id && !action.payload.id.startsWith('tmp-');
      
      if (isConfirmedMessage) {
        // Remove any temporary messages with matching content/sender to avoid duplicates
        state.chatHistory = state.chatHistory.filter(msg => {
          if (!msg.id.startsWith('tmp-')) return true;
          
          // Check if this temp message is likely the one being confirmed
          const isSameSender = msg.sender_id === action.payload.sender_id;
          const isSameContent = msg.content === action.payload.content;
          
          return !(isSameSender && isSameContent);
        });
      }
      
      // Check if message already exists by ID (avoid duplicates)
      const existsById = state.chatHistory.some(
        msg => msg.id === action.payload.id
      );
      
      // Add to chat history if not a duplicate
      if (!existsById) {
        // Simplified message object - no time formatting
        const messageToAdd = {
          ...action.payload,
          // Keep timestamp only for internal ordering, not for display
          timestamp: action.payload.timestamp || new Date().toISOString(),
        };
        
        state.chatHistory.push(messageToAdd);
      }
    },
    
    messageReceived(state, { payload: msg }) {
      const me = state.myUserId;
      const otherId = msg.sender.id;

      // 1) append to chatHistory
      state.chatHistory.push({
        id:          msg.id,
        sender_id:   otherId,
        receiver_id: msg.receiver_id,
        content:     msg.content,
        timestamp:   msg.timestamp,
      });

      // 2) upsert contact
      let c = state.contacts.find(c => c.id === otherId);
      if (!c) {
        c = {
          id:                otherId,
          first_name:        msg.sender.first_name,
          last_name:         msg.sender.last_name,
          profile_image:     msg.sender.avatar,
          last_message:      msg.content,
          last_message_time: msg.timestamp,
          unread_count:      0,
          is_logged_in:      true,
          last_login:        msg.timestamp,
        };
        state.contacts.push(c);
      } else {
        c.last_message      = msg.content;
        c.last_message_time = msg.timestamp;
      }

      // 3) **only** bump unread if this message was sent **to me**, not by me,
      //     and I’m not actively viewing that chat
      if (
        msg.receiver_id === me &&
        otherId !== me &&
        //msg.sender.id !== me && 
        state.activeChat !== otherId
      ) {
        c.unread_count = (c.unread_count || 0) + 1;
      }

      // 4) keep your contact list sorted by recency
      state.contacts.sort((a, b) =>
        new Date(b.last_message_time) - new Date(a.last_message_time)
      );
    },

    // when user clicks into a chat:
    setActiveChat(state, { payload: chatId }) {
      state.activeChat = chatId;
      const c = state.contacts.find(c => c.id === chatId);
      if (c) c.unread_count = 0;
    },
    
    // Clean addContact reducer - only cares about contacts
    addContact: (state, action) => {
      const idx = state.contacts.findIndex(c => c.id === action.payload.id);
      if (idx === -1) {
        state.contacts.push(action.payload);
      } else {
        // Merge any updated fields
        state.contacts[idx] = { 
          ...state.contacts[idx], 
          ...action.payload,
          unread_count: state.contacts[idx].unread_count || action.payload.unread_count || 0,
          is_logged_in: action.payload.is_logged_in ?? state.contacts[idx].is_logged_in,
          last_login: action.payload.last_login || state.contacts[idx].last_login
        };
      }

      state.contacts.sort((a, b) => {
        if (!a.last_message_time) return 1;
        if (!b.last_message_time) return -1;
        return new Date(b.last_message_time) - new Date(a.last_message_time);
      });
    },
    
    // Helper reducer for updating just the last message
    updateContactLastMessage: (state, action) => {
      const idx = state.contacts.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.contacts[idx].last_message = action.payload.last_message;
        state.contacts[idx].last_message_time = action.payload.last_message_time;
      }
    },
    
    updateContactPresence(state, { payload: { userId, is_online, timestamp } }) {
      const idx = state.contacts.findIndex(c => c.id === userId);
      if (idx !== -1) {
        state.contacts[idx].is_logged_in = is_online;
        state.contacts[idx].last_login   = timestamp;
      }
    },
    
    setWebsocketConnected: (state, action) => {
      state.wsConnected = action.payload;
    },

    clearChatHistory: (state) => {
      state.chatHistory = [];
    },

    incrementUnread: (state, action) => {
      const idx = state.contacts.findIndex(c => c.id === action.payload);
      if (idx !== -1) state.contacts[idx].unread_count += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat history
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("[fetchHistory] got timestamps:", action.payload.map(m => m.timestamp));
        // state.chatHistory = action.payload;
        state.chatHistory = action.payload
               .slice()
               .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload.map(c => ({
          ...c,
          unread_count: c.unread_count ?? 0
        }));
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        // Optionally handle pending state for send message
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // No need to update state here as we'll get the message back from the WebSocket
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(syncContactStatuses.fulfilled, (state, action) => {
        const apiContacts = action.payload;
        
        apiContacts.forEach(apiContact => {
          const idx = state.contacts.findIndex(c => c.id === apiContact.id);
          if (idx !== -1) {
            // Update existing contact's status fields
            state.contacts[idx].is_logged_in = apiContact.is_logged_in;
            state.contacts[idx].last_login = apiContact.last_login;
          }
        });
      });
  }
});

export const { 
  addMessage, 
  addContact, 
  updateContactLastMessage,
  setActiveChat, 
  setWebsocketConnected,
  incrementUnread ,
  clearChatHistory,
  messageReceived,
  setMyUserId,
  updateContactPresence
} = messageSlice.actions;

export default messageSlice.reducer;