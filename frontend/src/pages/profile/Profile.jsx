import React, { useState, useEffect } from "react";
import { Box, Container, Tabs, Tab, Typography } from "@mui/material";
import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoTab from "./profileTabs/personalInfoTab";
import RoommatePreferencesTab from "./profileTabs/RoommatePreferencesTab";
import FeedbackRatingsTab from "./profileTabs/FeedbackRatingsTab";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { updateUserPassword } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const { profile, status, error } = useSelector((state) => state.user);
  const { id } = useSelector((state) => state.auth);

  console.log("profile",id)
  useEffect(() => {
    const userId = id || localStorage.getItem('id');
    
    if (userId && userId !== 'null' && userId !== null && !isNaN(userId)) {
      dispatch(fetchUserProfile(parseInt(userId, 10)));
    }
  }, [dispatch, id]);

  // Handle tab switching
  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  // Function to refresh profile data
  const refreshProfile = () => {
    if (id) {
      dispatch(fetchUserProfile(id));
    }
  };

  // Optional: Add loading and error handling
  if (status === "loading") return <Typography>Loading profile...</Typography>;
  if (error) return <Typography>Error loading profile: {error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Profile
      </Typography>

      {/* The ProfileHeader displays updated profile photo and major */}
      <ProfileHeader profile={profile} />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          variant="fullWidth"
        >
          <Tab label="Profile" />
          <Tab label="Roommate Preferences" />
          <Tab label="Feedback & Ratings" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <PersonalInfoTab
          profile={profile}
          refreshProfile={refreshProfile}
          user_id={id}
        />
      )}
      {tabValue === 1 && <RoommatePreferencesTab profile={profile} />}
      {tabValue === 2 && <FeedbackRatingsTab profile={profile} />}
    </Container>
  );
};

export default ProfilePage;
