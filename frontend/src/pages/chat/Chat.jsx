import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Divider,
  IconButton,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Send,
  AttachFile,
  Search,
  MoreVert,
  Phone,
  ArrowBack,
  CheckCircle,
  AccessTime
} from '@mui/icons-material';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showConversations, setShowConversations] = useState(true);
  
  const messagesEndRef = useRef(null);
  
  // Simulated user data (in a real app, this would come from authentication)
  const currentUser = {
    id: 'user123',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowConversations(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Simulate fetching conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/conversations');
        // const data = await response.json();
        
        // Simulated data
        const data = [
          { 
            id: 'conv1', 
            user: { 
              id: 'user456', 
              name: 'Jordan Smith', 
              avatar: 'https://randomuser.me/api/portraits/women/65.jpg' 
            },
            lastMessage: 'Is the room still available?',
            unread: 2,
            timestamp: '10:23 AM'
          },
          { 
            id: 'conv2', 
            user: { 
              id: 'user789', 
              name: 'Taylor Wong',
              avatar: 'https://randomuser.me/api/portraits/men/44.jpg' 
            },
            lastMessage: 'What utilities are included?',
            unread: 0,
            timestamp: 'Yesterday'
          },
          { 
            id: 'conv3', 
            user: { 
              id: 'user101', 
              name: 'Casey Martinez', 
              avatar: 'https://randomuser.me/api/portraits/women/22.jpg' 
            },
            lastMessage: 'Thanks for the information!',
            unread: 0,
            timestamp: 'Apr 12'
          }
        ];
        
        setConversations(data);
        setLoading(false);
        
        // Set the first conversation as active by default
        if (data.length > 0 && !currentConversation) {
          setCurrentConversation(data[0]);
          fetchMessages(data[0].id);
        }
      } catch (err) {
        setError('Failed to load conversations');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Simulate fetching messages for a conversation
  const fetchMessages = async (conversationId) => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/conversations/${conversationId}/messages`);
      // const data = await response.json();
      
      // Simulated data
      const data = [
        {
          id: 'msg1',
          sender: { id: 'user456', name: 'Jordan Smith' },
          content: 'Hi there! I saw your listing for the room. Is it still available?',
          timestamp: '10:15 AM',
          isRead: true
        },
        {
          id: 'msg2',
          sender: { id: 'user123', name: 'Alex Johnson' },
          content: 'Yes, it is! Would you like to know more about it?',
          timestamp: '10:18 AM',
          isRead: true
        },
        {
          id: 'msg3',
          sender: { id: 'user456', name: 'Jordan Smith' },
          content: 'That would be great. Could you tell me about the neighborhood and how close it is to public transit?',
          timestamp: '10:20 AM',
          isRead: true
        },
        {
          id: 'msg4',
          sender: { id: 'user123', name: 'Alex Johnson' },
          content: 'The house is in a quiet residential area, about 10 minutes walk from the nearest subway station. There are several bus stops within 5 minutes walk too.',
          timestamp: '10:22 AM',
          isRead: true
        },
        {
          id: 'msg5',
          sender: { id: 'user456', name: 'Jordan Smith' },
          content: 'Is the room still available?',
          timestamp: '10:23 AM',
          isRead: false
        }
      ];
      
      setMessages(data);
      setLoading(false);
      
      if (isMobile) {
        setShowConversations(false);
      }
    } catch (err) {
      setError('Failed to load messages');
      setLoading(false);
      console.error(err);
    }
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentConversation) return;
    
    const messageCopy = newMessage.trim();
    setNewMessage('');
    
    // Optimistically add message to UI
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: currentUser,
      content: messageCopy,
      timestamp: 'Just now',
      isRead: true,
      isSending: true
    };
    
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      setIsTyping(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send the message to your API
      /*
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: currentConversation.id,
          content: messageCopy
        })
      });
      const data = await response.json();
      */
      
      // Replace optimistic message with "real" one from server
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, id: `msg-${Date.now()}`, isSending: false } 
          : msg
      ));
      
      // Simulate receiving a reply
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: currentConversation.user,
          content: "Thanks for the information! Would it be possible to schedule a viewing sometime this week?",
          timestamp: 'Just now',
          isRead: true
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 2000);
      
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
      
      // Remove failed message from UI or mark as failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };
  
  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation.id);
    
    // Mark conversation as read (would be an API call in real app)
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv
      )
    );
  };
  
  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleBackToList = () => {
    setShowConversations(true);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      {/* Conversations List */}
      {(!isMobile || showConversations) && (
        <Paper 
          elevation={3} 
          sx={{ 
            width: isMobile ? '100%' : 320, 
            display: 'flex', 
            flexDirection: 'column',
            zIndex: 1,
            position: isMobile ? 'absolute' : 'relative',
            height: '100%'
          }}
        >
          <Box sx={{ p: 2, bgcolor: '#6200ee', color: 'white' }}>
            <Typography variant="h6">Messages</Typography>
            <TextField
              fullWidth
              placeholder="Search conversations"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ 
                mt: 1,
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <List sx={{ 
            flex: 1, 
            overflowY: 'auto',
            bgcolor: 'background.paper' 
          }}>
            {loading && conversations.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : filteredConversations.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  No conversations found
                </Typography>
              </Box>
            ) : (
              filteredConversations.map(conversation => (
                <React.Fragment key={conversation.id}>
                  <ListItem 
                    button 
                    selected={currentConversation?.id === conversation.id}
                    onClick={() => selectConversation(conversation)}
                    sx={{
                      bgcolor: currentConversation?.id === conversation.id ? 'rgba(98, 0, 238, 0.08)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(98, 0, 238, 0.04)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        badgeContent={conversation.unread > 0 ? conversation.unread : 0}
                        color="error"
                      >
                        <Avatar 
                          alt={conversation.user.name} 
                          src={conversation.user.avatar}
                        />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="subtitle1" 
                          component="span" 
                          sx={{ 
                            fontWeight: conversation.unread > 0 ? 'bold' : 'normal',
                            color: conversation.unread > 0 ? 'text.primary' : 'text.primary',
                          }}
                        >
                          {conversation.user.name}
                        </Typography>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography 
                            variant="body2" 
                            component="span" 
                            sx={{ 
                              color: conversation.unread > 0 ? 'text.primary' : 'text.secondary',
                              fontWeight: conversation.unread > 0 ? 'medium' : 'normal',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '180px',
                            }}
                          >
                            {conversation.lastMessage}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            component="span" 
                            sx={{ 
                              color: conversation.unread > 0 ? 'primary.main' : 'text.secondary',
                              ml: 1,
                            }}
                          >
                            {conversation.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            )}
          </List>
          
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={currentUser.avatar} alt={currentUser.name} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2">{currentUser.name}</Typography>
                <Typography variant="caption" color="textSecondary">Available</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
      
      {/* Chat Area */}
      {(!isMobile || !showConversations) && currentConversation && (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          overflow: 'hidden',
        }}>
          {/* Chat Header */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 1.5, 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: '#6200ee',
              color: 'white'
            }}
          >
            {isMobile && (
              <IconButton color="inherit" onClick={handleBackToList} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
            )}
            <Avatar 
              src={currentConversation.user.avatar} 
              alt={currentConversation.user.name} 
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography variant="subtitle1">{currentConversation.user.name}</Typography>
              <Typography variant="caption">Potential Roommate</Typography>
            </Box>
            <IconButton color="inherit">
              <Phone />
            </IconButton>
            <IconButton color="inherit">
              <MoreVert />
            </IconButton>
          </Paper>
          
          {/* Messages */}
          <Box 
            sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              p: 2,
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {loading && messages.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.map(message => (
                  <Box 
                    key={message.id}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: message.sender.id === currentUser.id ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    {message.sender.id !== currentUser.id && (
                      <Avatar 
                        src={currentConversation.user.avatar} 
                        alt={currentConversation.user.name}
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1, 
                          mt: 1 
                        }}
                      />
                    )}
                    <Box>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 2,
                          maxWidth: '75%',
                          bgcolor: message.sender.id === currentUser.id ? '#6200ee' : 'white',
                          color: message.sender.id === currentUser.id ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                      </Paper>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: message.sender.id === currentUser.id ? 'flex-end' : 'flex-start',
                          mt: 0.5
                        }}
                      >
                        <Typography variant="caption" color="textSecondary">
                          {message.timestamp}
                        </Typography>
                        {message.sender.id === currentUser.id && (
                          <Box component="span" sx={{ display: 'inline-block', ml: 0.5 }}>
                            {message.isSending ? (
                              <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                            ) : message.isRead ? (
                              <CheckCircle sx={{ fontSize: 14, color: '#6200ee' }} />
                            ) : (
                              <CheckCircle sx={{ fontSize: 14, color: 'text.secondary' }} />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
                
                {isTyping && (
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <Avatar 
                      src={currentConversation.user.avatar} 
                      alt={currentConversation.user.name}
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 1 
                      }}
                    />
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: 'white',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.400', animation: 'pulse 1s infinite' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.400', animation: 'pulse 1s infinite 0.2s' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.400', animation: 'pulse 1s infinite 0.4s' }} />
                      </Box>
                    </Paper>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </Box>
            )}
          </Box>
          
          {/* Message Input */}
          <Paper 
            component="form" 
            onSubmit={handleSendMessage}
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <IconButton color="default">
              <AttachFile />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Type a message"
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              size="small"
              sx={{ mx: 1 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={!newMessage.trim()}
              sx={{ 
                borderRadius: 50,
                minWidth: 0,
                width: 40,
                height: 40,
                p: 0,
                bgcolor: '#6200ee',
                '&:hover': {
                  bgcolor: '#3700b3'
                }
              }}
            >
              <Send />
            </Button>
          </Paper>
        </Box>
      )}
      
      {/* Empty state when no conversation is selected */}
      {(!isMobile || !showConversations) && !currentConversation && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            p: 3,
          }}
        >
          <Avatar sx={{ width: 100, height: 100, mb: 3, bgcolor: '#6200ee' }}>
            <img src="/api/placeholder/100/100" alt="chat" style={{ width: '60%', height: '60%' }} />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Welcome to Roommate Chat
          </Typography>
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Select a conversation to start messaging potential roommates.
          </Typography>
        </Box>
      )}
      
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default Chat;