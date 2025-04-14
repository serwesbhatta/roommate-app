
import React from 'react';
import { Box, Paper, Avatar, Typography } from '@mui/material';
import {getImageUrl} from "../../utils/imageURL"

const ProfileHeader = ({ profile }) => {
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
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Avatar
          src={getImageUrl(profile?.profile_image ||"/default-avatar.png")}
          alt={profile && profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : 'Profile Photo'}
          sx={{ width: 120, height: 120, border: '3px solid white' }}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User' : 'John Doe'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          {profile ? (profile.majors || 'Your Major') : 'Major not set'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProfileHeader;