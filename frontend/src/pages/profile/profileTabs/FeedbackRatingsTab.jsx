// src/pages/profile/profileTabs/FeedbackRatingsTab.jsx
import React, { useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FeedbackItem } from "../../../components/profile";
import { fetchFeedbackReceived } from "../../../redux/slices/feedbackSlice";
import { fetchAllUserProfiles } from "../../../redux/slices/userSlice";   // ← make sure this is the correct slice
import { getImageUrl } from "../../../utils/imageURL";

const FeedbackRatingsTab = () => {
  const dispatch = useDispatch();

  // ─────────────────────── Redux state ────────────────────────
  const { id: currentUserId } = useSelector((state) => state.auth);
  const { profiles } = useSelector((state) => state.user);
  const { received, loading } = useSelector((state) => state.feedback);

  /* ─────────────── Fetch data ONCE when the tab mounts ─────────────── */
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchFeedbackReceived({ userId: currentUserId, skip: 0, limit: 100 }));
      if (!profiles.length) {
        dispatch(fetchAllUserProfiles({ skip: 0, limit: 100 }));
      }
    }
  }, [dispatch, currentUserId]);         

  /* ───────────── Filter to only the feedback meant for *me* ──────────── */
  const myFeedbackReceived = useMemo(
    () =>
      received?.filter(
        (f) => Number(f.receiver_user_id) === Number(currentUserId)
      ) || [],
    [received, currentUserId]
  );

  /* ───────────── Map giver → profile (name + avatar) helper ──────────── */
  const enrich = (fb) => {
    const giver = profiles.find(
      (p) => Number(p.id) === Number(fb.giver_user_id)
    );
    return {
      name: giver ? `${giver.first_name} ${giver.last_name}` : `User ${fb.giver_user_id}`,
      avatar: getImageUrl(giver?.profile_image ||"/default-avatar.png"),
      date: new Date(fb.created_at).toLocaleDateString(),
      rating: fb.rating ?? 0,
      comment: fb.feedback_text ?? "",
    };
  };

  /* ───────────────────────────── UI ───────────────────────────── */
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Roommate Feedback
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : myFeedbackReceived.length ? (
            myFeedbackReceived.map((fb, idx) => {
              const info = enrich(fb);
              return (
                <Box key={fb.id ?? idx} mb={idx < myFeedbackReceived.length - 1 ? 2 : 0}>
                  <FeedbackItem
                    name={info.name}
                    avatar={info.avatar}     
                    date={info.date}
                    rating={info.rating}
                    comment={info.comment}
                  />
                  {idx < myFeedbackReceived.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              );
            })
          ) : (
            <Typography align="center" color="text.secondary" py={3}>
              No feedback received yet.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FeedbackRatingsTab;
