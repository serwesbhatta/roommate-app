// File: components/ProfileHeader.jsx
import React from 'react';
import { Box, Paper, Avatar, Typography, IconButton } from '@mui/material';
import { 
  Camera as CameraIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon
} from '@mui/icons-material';

const ProfileHeader = () => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        bgcolor: 'black', 
        color: 'white', 
        borderRadius: 2, 
        mb: 3, 
        mt: 2,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 4
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar 
            src="/api/placeholder/120/120" 
            alt="Profile Picture" 
            sx={{ width: 120, height: 120, border: '3px solid white' }}
          />
          <IconButton 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0, 
              bgcolor: 'white',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            size="small"
          >
            <CameraIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="h6" sx={{ mt: 2 }}>
          John Doe
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ color: 'gray' }}>
          Masters in Computer Science
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
            <TwitterIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
            <FacebookIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileHeader;