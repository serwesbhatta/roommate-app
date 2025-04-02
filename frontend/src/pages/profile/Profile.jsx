// File: ProfilePage.jsx - Main profile container with tabs
import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import { Person as PersonIcon, Group as GroupIcon, Star as StarIcon } from '@mui/icons-material';

// Components
import {TabPanel, ProfileHeader, } from '../../components/profile';
import PersonalInfoTab from './profileTabs/personalInfoTab';
import RoommatePreferencesTab from './profileTabs/RoommatePreferencesTab';
import FeedbackRatingsTab from './profileTabs/FeedbackRatingsTab';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
        Hello! Ready to update your profile.
      </Typography>

      {/* Profile Header Card */}
      <ProfileHeader />

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          variant="fullWidth"
        >
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<GroupIcon />} label="Roommate Preferences" />
          <Tab icon={<StarIcon />} label="Feedback & Ratings" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <PersonalInfoTab />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <RoommatePreferencesTab />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <FeedbackRatingsTab />
      </TabPanel>
    </Container>
  );
};

export default Profile;

