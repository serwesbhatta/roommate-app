import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import ProfileCard from './ProfileCard'; 

const ProfileCardGrid = ({ profiles, onViewProfile, getImageUrl }) => {

  return (
    <Box>
      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <ProfileCard profile={profile}  onViewProfile = {onViewProfile}  getImageUrl={getImageUrl}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileCardGrid;