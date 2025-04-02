// CurrentRoommateCard.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import ProfileCard from "./ProfileCard"; // Your existing ProfileCard component

const CurrentRoommateCard = ({ roommate }) => {
  const [openFeedback, setOpenFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleOpenFeedback = () => {
    setOpenFeedback(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
  };

  const handleSubmitFeedback = () => {
    // Implementation for submitting feedback
    console.log("Submitting feedback:", { rating, feedback });
    setOpenFeedback(false);
  };

  return (
    <>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
            <Box flex={1}>
              <ProfileCard profile={roommate} />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              ml={{ xs: 0, sm: 2 }}
              mt={{ xs: 2, sm: 0 }}
            >
              <Typography variant="body1" gutterBottom>
                Current Rating: {roommate.rating}/5 ({roommate.reviews} reviews)
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenFeedback}
              >
                Rate & Review
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={openFeedback} onClose={handleCloseFeedback}>
        <DialogTitle>Rate Your Roommate</DialogTitle>
        <DialogContent>
          <Box py={1}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="roommate-rating"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
          </Box>
          <Box py={1}>
            <TextField
              autoFocus
              margin="dense"
              id="feedback"
              label="Feedback"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Cancel</Button>
          <Button onClick={handleSubmitFeedback} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CurrentRoommateCard;
