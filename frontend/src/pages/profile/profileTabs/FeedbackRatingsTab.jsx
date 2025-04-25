import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { FeedbackItem } from "../../../components/profile";
import { getImageUrl } from "../../../utils/imageURL";

const FeedbackRatingsTab = ({ currentUserId, profiles, feedbackList, isLoading }) => {
  /* ───────────── Filter to only the feedback meant for *me* ──────────── */
  console.log("date recieved in feedback",feedbackList)

  const myFeedbackReceived = useMemo(
    () =>
      feedbackList?.filter(
        (f) => Number(f.receiver_user_id) === Number(currentUserId)
      ) || [],
    [feedbackList, currentUserId]
  );

  console.log("myFeedbackRecieved",myFeedbackReceived)

  /* ───────────── Map giver → profile (name + avatar) helper ──────────── */
  const enrich = (fb) => {
    const giver = profiles.find(
      (p) => Number(p.id) === Number(fb.giver_user_id)
    );
    return {
      name: giver ? `${giver.first_name} ${giver.last_name}` : `User ${fb.giver_user_id}`,
      avatar: getImageUrl(giver?.profile_image || "/default-avatar.png"),
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

          {isLoading ? (
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