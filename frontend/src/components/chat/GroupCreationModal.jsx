import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem, 
  Checkbox, 
  ListItemText, 
  Avatar, 
  ListItemAvatar,
  TextField,
  Box,
  Typography,
  Divider
} from '@mui/material';

const dummyUsers = [
  { id: 'u1', name: 'Jane Doe', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { id: 'u2', name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 'u3', name: 'Sam Lee', avatar: 'https://randomuser.me/api/portraits/men/56.jpg' },
  { id: 'u4', name: 'Eva Brown', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
  { id: 'u5', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { id: 'u6', name: 'Lisa Wang', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
];

const GroupCreationModal = ({ open, onClose, onCreate }) => {
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState('');
  
  const handleToggleUser = (id) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleCreate = () => {
    if (selected.length >= 2) {
      onCreate({
        members: selected,
        name: groupName.trim() || `Group (${selected.length + 1})`
      });
      handleReset();
    }
  };

  const handleReset = () => {
    setSelected([]);
    setGroupName('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #efefef', pb: 2 }}>
        Create Group Chat
      </DialogTitle>
      
      <DialogContent sx={{ py: 2 }}>
        <TextField
          fullWidth
          label="Group Name"
          variant="outlined"
          margin="normal"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name (optional)"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#4a7fff',
              },
            }
          }}
        />

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Select at least 2 members
        </Typography>
        
        <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          <List disablePadding>
            {dummyUsers.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem button onClick={() => handleToggleUser(user.id)}>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <Checkbox 
                    checked={selected.includes(user.id)}
                    sx={{
                      '&.Mui-checked': {
                        color: '#4a7fff',
                      },
                    }}
                  />
                </ListItem>
                {index < dummyUsers.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid #efefef' }}>
        <Button 
          onClick={handleClose}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={selected.length < 2}
          onClick={handleCreate}
          sx={{ 
            bgcolor: '#4a7fff',
            '&:hover': {
              bgcolor: '#3a6ae8'
            },
            '&.Mui-disabled': {
              bgcolor: '#c5d3f7'
            }
          }}
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupCreationModal;