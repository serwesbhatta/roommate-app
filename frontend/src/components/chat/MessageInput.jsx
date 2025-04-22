import React, { useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';
import { Send } from '@mui/icons-material';

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <Paper 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        p: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: 'white',
        borderTop: '1px solid #efefef'
      }}
    >
      <TextField
        fullWidth
        placeholder="Type a message"
        variant="outlined"
        size="small"
        value={text}
        onChange={e => setText(e.target.value)}
        sx={{ 
          mr: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            '&.Mui-focused fieldset': {
              borderColor: '#4a7fff',
            },
          }
        }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ 
          minWidth: 0, 
          width: 40, 
          height: 40, 
          p: 0, 
          borderRadius: '50%',
          bgcolor: '#4a7fff',
          '&:hover': {
            bgcolor: '#3a6ae8'
          }
        }}
      >
        <Send />
      </Button>
    </Paper>
  );
};

export default MessageInput;