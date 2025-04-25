import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoTab from "./profileTabs/personalInfoTab";
import RoommatePreferencesTab from "./profileTabs/RoommatePreferencesTab";
import FeedbackRatingsTab from "./profileTabs/FeedbackRatingsTab";

import {
  fetchUserProfile,
  updateUserProfile,
  fetchAllUserProfiles,
} from "../../redux/slices/userSlice";
import { updateUserPassword } from "../../redux/slices/authSlice";
import {
  getQuestionOptionsList,
  getUserResponses,
  putUserResponses,
} from "../../redux/slices/questionnaireSlice";
import { fetchFeedbackReceived } from "../../redux/slices/feedbackSlice";

/* ───────────────────────────
   Tab value constants
   ─────────────────────────── */
const TAB_PROFILE  = "profile";
const TAB_PREFS    = "prefs";
const TAB_FEEDBACK = "feedback";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch  = useDispatch();
  const { userId: urlUserId } = useParams();

  /* ----- who’s profile are we looking at? ----- */
  const { id: currentUserId } = useSelector((s) => s.auth);
  const profileUserId         = urlUserId || currentUserId;
  const isOwnProfile          = Number(profileUserId) === Number(currentUserId);

  /* ----- redux state ----- */
  const { profile, status, error, profiles } = useSelector((s) => s.user);
  const { questions, userResponses }         = useSelector((s) => s.questionnaire);
  const { received, loading: feedbackLoading } = useSelector((s) => s.feedback);

  /* ----- local state ----- */
  const [tabValue, setTabValue] = useState(TAB_PROFILE);

  /* ─── Data fetching ────────────────────────── */
  /* Profile */
  useEffect(() => {
    if (profileUserId && !isNaN(profileUserId)) {
      dispatch(fetchUserProfile(Number(profileUserId)));
    }
  }, [dispatch, profileUserId]);

  /* Questionnaire */
  useEffect(() => {
    if (profileUserId && tabValue === TAB_PREFS) {
      dispatch(getQuestionOptionsList({ skip: 0, limit: 100 }));
      dispatch(getUserResponses(profileUserId));
    }
  }, [dispatch, profileUserId, tabValue]);

  /* Feedback */
  useEffect(() => {
    if (profileUserId && tabValue === TAB_FEEDBACK) {
      dispatch(fetchFeedbackReceived({ userId: profileUserId, skip: 0, limit: 100 }));
      if (!profiles.length) {
        dispatch(fetchAllUserProfiles({ skip: 0, limit: 100 }));
      }
    }
  }, [dispatch, profileUserId, profiles.length, tabValue]);

  /* ─── Handlers ─────────────────────────────── */
  const handleTabChange = (_e, newValue) => setTabValue(newValue);

  const refreshProfile = () => {
    if (profileUserId) dispatch(fetchUserProfile(profileUserId));
  };

  const handleUpdateProfile = async (formData) => {
    try {
      await dispatch(updateUserProfile({ userId: profileUserId, profileData: formData })).unwrap();
      refreshProfile();
      return { success: true };
    } catch (err) {
      console.error("Save profile failed:", err);
      return { success: false, error: err };
    }
  };

  const handleUpdatePassword = async (passwordData) => {
    try {
      await dispatch(updateUserPassword({ user_id: profileUserId, updateData: passwordData })).unwrap();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const handleUpdatePreferences = async (responses) => {
    try {
      await dispatch(putUserResponses({ userProfileId: profileUserId, responses: { responses } })).unwrap();
      dispatch(getUserResponses(profileUserId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  /* ─── Early states ─────────────────────────── */
  if (status === "loading") return <Typography>Loading profile…</Typography>;
  if (error)               return <Typography>Error loading profile: {error}</Typography>;

  /* ─── Render ───────────────────────────────── */
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* Header with back arrow */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ position: "absolute", left: 0 }} aria-label="Back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isOwnProfile ? "My Profile" : `${profile?.first_name}'s Profile`}
        </Typography>
      </Box>

      {/* profile photo & basic info */}
      <ProfileHeader profile={profile} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">

          <Tab value={TAB_PROFILE}   label="Profile" />

          {isOwnProfile && (
            <Tab value={TAB_PREFS} label="Roommate Preferences" />
          )}

          <Tab value={TAB_FEEDBACK} label="Feedback & Ratings" />
        </Tabs>
      </Box>

      {/* Tab panels */}
      {tabValue === TAB_PROFILE && (
        <PersonalInfoTab
          profile={profile}
          isReadOnly={!isOwnProfile}
          onUpdateProfile={isOwnProfile ? handleUpdateProfile : undefined}
          onUpdatePassword={isOwnProfile ? handleUpdatePassword : undefined}
        />
      )}

      {tabValue === TAB_PREFS && isOwnProfile && (
        <RoommatePreferencesTab
          questions={questions}
          userResponses={userResponses}
          onUpdatePreferences={handleUpdatePreferences}
        />
      )}

      {tabValue === TAB_FEEDBACK && (
        <FeedbackRatingsTab
          currentUserId={profileUserId}
          profiles={profiles}
          feedbackList={received}
          isLoading={feedbackLoading}
        />
      )}
    </Container>
  );
};

export default ProfilePage;
