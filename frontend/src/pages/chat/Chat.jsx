// pages/chat/index.js
import React from 'react';
import { Box, Paper, Alert, Snackbar } from '@mui/material';
import { ChatPanel, ConversationList } from '../../components/chat';
import { useChat } from './useChat';
import { useSelector } from 'react-redux';

const Chat = () => {
  const { error } = useSelector(state => state.messages);
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    showGroupModal,
    wsConnected,
    handleSelectConversation,
    handleSendMessage,
    handleCreateGroup,
    setCurrentConversation,
    setShowGroupModal
  } = useChat();

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f8f9fa' }}>
      <Paper 
        sx={{ 
          width: 300, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 0,
          boxShadow: '0 0 10px rgba(0,0,0,0.05)'
        }}
      >
        <ConversationList
          conversations={conversations}
          loading={loading}
          onSelect={handleSelectConversation}
          onNewGroup={() => setShowGroupModal(true)}
        />
      </Paper>

      <ChatPanel
        currentConversation={currentConversation}
        messages={messages}
        loading={loading}
        onBack={() => setCurrentConversation(null)}
        onSend={handleSendMessage}
        showGroupModal={showGroupModal}
        onCloseGroupModal={() => setShowGroupModal(false)}
        onCreateGroup={handleCreateGroup}
      />
      
      {/* Connection status indicator */}
      <Snackbar 
        open={!wsConnected} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning">
          Connection lost. Reconnecting...
        </Alert>
      </Snackbar>
      
      {/* Error message display */}
      <Snackbar 
        open={!!error} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Chat;