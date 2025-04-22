import {
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatHistory,
  fetchContacts,
  sendMessage,
  setActiveChat,
  addMessage,
  addContact,
  updateContactLastMessage,
  messageReceived,
  setWebsocketConnected,
  clearChatHistory,
  setMyUserId,
  updateContactPresence,
} from "../../redux/slices/messageSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { fetchAllAuthUsers } from "../../redux/slices/authSlice";
import messageService from "../../redux/services/messageService";

export const useChat = () => {
  const dispatch = useDispatch();
  const authId  = useSelector(s => s.auth.id);
  const profile = useSelector(s => s.user.profile);
  const {
    chatHistory,
    contacts,
    isLoading,
    activeChat,
    wsConnected,
    error
  } = useSelector(s => s.messages);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);

  // ------------------------------------------------------------------
  // 1) Fetch all users every minute
  // ------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchAllAuthUsers({ skip: 0, limit: 100 }));
    const id = setInterval(() => {
      dispatch(fetchAllAuthUsers({ skip: 0, limit: 100 }));
    }, 60_000);
    return () => clearInterval(id);
  }, [dispatch]);

  // ------------------------------------------------------------------
  // 2) Load my profile once
  // ------------------------------------------------------------------
  useEffect(() => {
    if (authId) dispatch(fetchUserProfile(authId));
  }, [authId, dispatch]);

  // ------------------------------------------------------------------
  // 3) Load my contacts once I have a profile
  // ------------------------------------------------------------------
  useEffect(() => {
    if (profile?.user_id){ 
      dispatch(setMyUserId(profile.user_id));
      dispatch(fetchContacts(profile.user_id));
    }
  }, [profile?.user_id, dispatch]);

  // ------------------------------------------------------------------
  // 4) Single WebSocket hookup — dispatch every incoming message
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!profile?.user_id) return;

    messageService.connectWebSocket(
      profile.user_id,

      raw => {
        // 1) Presence event?
        if (raw.type === 'presence') {
          dispatch(updateContactPresence({
            userId:    raw.user_id,
            is_online: raw.is_online,
            timestamp: raw.timestamp
          }));
          return;
        }
  
        // 2) Otherwise, chat payload
        const msg = raw.status === 'success' && raw.data ? raw.data : raw;
        if (msg.sender.id === profile.user_id) return;
        dispatch(messageReceived(msg));
      },

      // onOpen → flip wsConnected flag
      () => dispatch(setWebsocketConnected(true)),

      // onClose → flip wsConnected flag
      () => dispatch(setWebsocketConnected(false))
    );

    // cleanup
    return () => {
      messageService.disconnectWebSocket();
    };
  }, [profile?.user_id, dispatch]);


  // ------------------------------------------------------------------
  // 5) Map contacts into Conversation objects
  // ------------------------------------------------------------------
  const conversations = useMemo(() =>
    contacts.map(c => ({
      id: String(c.id),
      user: {
        id:    String(c.id),
        name:  `${c.first_name} ${c.last_name}`.trim(),
        avatar:c.profile_image || "/default-avatar.png",
      },
      lastMessage: c.last_message ?? "",
      unread:      c.unread_count ?? 0,
      isGroup:     c.is_group ?? false,
      online:      c.is_logged_in ?? false,
      lastSeen:    c.last_login ?? null,
    }))
  , [contacts]);

  // ------------------------------------------------------------------
  // 6) Refresh contact list when profile changes
  // ------------------------------------------------------------------
  useEffect(() => {
    if (profile?.user_id) {
      dispatch(fetchContacts(profile.user_id));
    }
  }, [profile?.user_id, dispatch]);

  // ------------------------------------------------------------------
  // 7) Load chat history when switching conversations
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!currentConversation?.user?.id || !profile?.user_id) return;
    dispatch(clearChatHistory());
    dispatch(fetchChatHistory({
      currentUserId: profile.user_id,
      otherUserId:   parseInt(currentConversation.user.id, 10),
      skip:  0,
      limit: 100
    }));
  }, [currentConversation?.user?.id, profile?.user_id, dispatch]);

  // ------------------------------------------------------------------
  // 8) Prepare messages for MessageList
  // ------------------------------------------------------------------
  const messages = useMemo(() => {
    if (!currentConversation || !profile?.user_id) return [];
    const otherId = parseInt(currentConversation.user.id, 10);

    return chatHistory
      .filter(m =>
        (m.sender_id === profile.user_id && m.receiver_id === otherId) ||
        (m.sender_id === otherId && m.receiver_id === profile.user_id)
      )
      .map(m => ({
        id: String(m.id),
        sender: {
          id:     String(m.sender_id),
          avatar: conversations.find(c => c.user.id === String(m.sender_id))?.user.avatar || "",
        },
        content: m.content,
        isMine:  m.sender_id === profile.user_id,
      }));
  }, [currentConversation, chatHistory, profile?.user_id, conversations]);

  // ------------------------------------------------------------------
  // 9) Handlers
  // ------------------------------------------------------------------
  const handleSelectConversation = useCallback(conv => {
    setCurrentConversation(conv);
    dispatch(setActiveChat(parseInt(conv.user.id, 10)));
  }, [dispatch]);

  const handleSendMessage = useCallback(text => {
    if (!currentConversation || !profile?.user_id) return;

    const receiverId = parseInt(currentConversation.user.id, 10);
    const nowISO = new Date().toISOString();
    const formattedTime = new Date().toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    });
    const tempId = `tmp-${Date.now()}`;

    // optimistic UI
    dispatch(addMessage({
      id:            tempId,
      sender_id:     profile.user_id,
      receiver_id:   receiverId,
      content:       text,
      timestamp:     nowISO,
      formatted_time: formattedTime,
      status:        'pending'
    }));

    // maintain contact
    const exists = contacts.some(c => c.id === receiverId);
    if (!exists) {
      dispatch(addContact({
        id:                 receiverId,
        first_name:         currentConversation.user.name.split(" ")[0],
        last_name:          currentConversation.user.name.split(" ")[1] || "",
        profile_image:      currentConversation.user.avatar,
        last_message:       text,
        last_message_time:  nowISO,
        unread_count:       0,
        is_group:           currentConversation.isGroup,
        is_logged_in:       false,
        last_login:         nowISO,
      }));
    } else {
      dispatch(updateContactLastMessage({
        id:               receiverId,
        last_message:     text,
        last_message_time: nowISO
      }));
    }

    // send through WS
    messageService.sendMessage({
      sender_id:    profile.user_id,
      receiver_id:  receiverId,
      content:      text,
      temp_id:      tempId
    }).catch(err => console.error("WS send failed", err));
  }, [currentConversation, profile, contacts, dispatch]);

  // ------------------------------------------------------------------
  // 10) Return hook API
  // ------------------------------------------------------------------
  return {
    conversations,
    currentConversation,
    messages,
    loading:       isLoading,
    showGroupModal,
    handleSelectConversation,
    handleSendMessage,
    handleCreateGroup: () => {},
    setCurrentConversation,
    setShowGroupModal,
    wsConnected,
    error,
  };
};

export default useChat;
