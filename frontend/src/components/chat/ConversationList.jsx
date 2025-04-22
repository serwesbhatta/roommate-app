import React from 'react';
import { 
  List, 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Divider
} from '@mui/material';
import ConversationItem from './ConversationItem';
import UserSearch from './UserSearch';

const ConversationList = ({ conversations, loading, onSelect, onNewGroup }) => (
  <>
    <Box 
      sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        bgcolor: 'white',
        borderBottom: '1px solid #efefef'
      }}
    >
      <Typography variant="h6" color="#333" fontWeight={600}>
        Chats
      </Typography>
      <Button 
        variant="contained" 
        size="small" 
        onClick={onNewGroup}
        sx={{ 
          bgcolor: '#4a7fff', 
          '&:hover': { bgcolor: '#3a6ae8' } 
        }}
      >
        New Group
      </Button>
    </Box>

    <Box sx={{ p: 2, bgcolor: 'white' }}>
      <UserSearch onSelectUser={onSelect} />
    </Box>
    
    <Divider />

    {loading ? (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress sx={{ color: '#4a7fff' }} />
      </Box>
    ) : (
      <List sx={{ overflowY: 'auto', flex: 1, p: 0 }}>
        {conversations.length > 0 ? (
          conversations.map(conv => (
            <ConversationItem 
              key={conv.id} 
              conversation={conv} 
              onSelect={() => onSelect(conv)} 
            />
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No conversations yet. Search for users to start chatting!
            </Typography>
          </Box>
        )}
      </List>
    )}
  </>
);

export default ConversationList;