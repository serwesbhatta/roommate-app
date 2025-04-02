import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import ProfileCard from './ProfileCard'; 

const ProfileCardGrid = ({ profiles, onLoadMore }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <ProfileCard profile={profile} />
          </Grid>
        ))}
      </Grid>
      
      <Box textAlign="center" mt={4}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={onLoadMore}
        >
          Load More Matches
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCardGrid;