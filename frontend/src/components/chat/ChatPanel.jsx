import React, { useRef, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import GroupCreationModal from './GroupCreationModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatPanel = ({
  currentConversation,
  messages,
  loading,
  onBack,
  onSend,
  showGroupModal,
  onCloseGroupModal,
  onCreateGroup
}) => {
  // Create a ref for auto-scrolling to bottom of messages
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        bgcolor: 'background.paper',
        borderLeft: '1px solid',
        borderColor: 'divider'
      }}
    >
      {currentConversation ? (
        <>
          <ChatHeader
            conversation={currentConversation}
            onBack={onBack}
          />
          
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            <MessageList
              messages={messages}
              loading={loading}
              currentUser={currentConversation.user}
              lastSeen={currentConversation.lastSeen}
              online={currentConversation.online}
            />
            <div ref={messagesEndRef} />
          </Box>
          
          <MessageInput
            onSend={onSend}
            disabled={loading}
            sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}
          />
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Start a New Conversation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Select a contact from the list or search for users
          </Typography>
        </Box>
      )}

      {showGroupModal && (
        <GroupCreationModal
          open={showGroupModal}
          onClose={onCloseGroupModal}
          onCreate={onCreateGroup}
        />
      )}
    </Box>
  );
};

export default ChatPanel;