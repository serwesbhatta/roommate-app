// File: FeedbackModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Rating,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  checkHasGiven,
  createFeedback,
  updateFeedback,
  fetchFeedbackGave,
} from "../../redux/slices/feedbackSlice";

const FeedbackModal = ({ open, onClose, roommate }) => {
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────────────────────────────────
  // Redux state
  // ────────────────────────────────────────────────────────────────────────────
  const { hasGiven, loading, error, gave } = useSelector(
    (state) => state.feedback
  );
  const { id: currentUserId } = useSelector((state) => state.auth);

  // ────────────────────────────────────────────────────────────────────────────
  // Local state
  // ────────────────────────────────────────────────────────────────────────────
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);     // tracks “a request just finished”
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);       // create vs. update mode

  // ────────────────────────────────────────────────────────────────────────────
  // 1. Every time the dialog opens → refresh the cache of feedback we gave
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && currentUserId) {
      dispatch(fetchFeedbackGave({ userId: currentUserId, skip: 0, limit: 100 }));
    }
  }, [dispatch, open, currentUserId]);

  // ────────────────────────────────────────────────────────────────────────────
  // 2. Check “has this user given feedback to roommate X?” on open / change
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && roommate && currentUserId) {
      dispatch(
        checkHasGiven({
          receiverUserId: roommate.user_id,
          giverUserId: currentUserId,
        })
      );
    }
  }, [dispatch, open, roommate, currentUserId]);

  // ────────────────────────────────────────────────────────────────────────────
  // 3. Populate the form whenever `gave` changes while the modal is open
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && roommate) {
      const existingFeedback = gave.find(
        (f) => f.receiver_user_id === roommate.user_id
      );

      if (existingFeedback) {
        setRating(existingFeedback.rating ?? 0);
        setComment(existingFeedback.feedback_text ?? "");
        setIsUpdate(true);
      } else {
        setRating(0);
        setComment("");
        setIsUpdate(false);
      }

      // ⚠️ Only clear success flags the first time the modal opens
      if (!submitted) {
        setSubmitSuccess(false);
      }
    }
  }, [open, roommate, gave, submitted]);

  // Keep local `isUpdate` in sync with the slice’s `hasGiven`
  useEffect(() => {
    setIsUpdate(hasGiven);
  }, [hasGiven]);

  // ────────────────────────────────────────────────────────────────────────────
  // Form submit handler
  // ────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!rating) return; // guard: rating is mandatory

    const payload = {
      receiver_user_id: roommate.user_id,
      giver_user_id:    currentUserId,
      rating:           Math.round(rating),
      feedback_text:    comment,
    };

    try {
      if (isUpdate || hasGiven) {
        await dispatch(
          updateFeedback({ receiverUserId: roommate.user_id, feedbackData: payload })
        ).unwrap();
      } else {
        await dispatch(createFeedback(payload)).unwrap();
      }

      // Refresh local cache so the UI is up‑to‑date
      await dispatch(fetchFeedbackGave({ userId: currentUserId, skip: 0, limit: 100 }));

      // Success banner
      setSubmitted(true);
      setSubmitSuccess(true);

      // Auto‑close after 1.5 s
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setSubmitted(true);
      setSubmitSuccess(false); // show error banner
    }
  };

  // Reset component state when modal closes
  const handleClose = () => {
    setSubmitted(false);
    setSubmitSuccess(false);
    onClose();
  };

  // Don’t render until a roommate is selected
  if (!roommate) return null;

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isUpdate ? "Update Feedback" : "Give Feedback"} for{" "}
        {roommate.first_name} {roommate.last_name}
      </DialogTitle>

      <DialogContent>
        {/* Success message */}
        {submitted && submitSuccess ? (
          <Box display="flex" justifyContent="center" my={4}>
            <Alert severity="success">
              Feedback {isUpdate ? "updated" : "submitted"} successfully!
            </Alert>
          </Box>
        ) : (
          <>
            {/* Star rating ---------------------------------------------------- */}
            <Box my={3}>
              <Typography variant="subtitle1" gutterBottom>
                Rating
              </Typography>
              <Rating
                name="roommate-rating"
                value={rating}
                onChange={(_, v) => setRating(v)}
                size="large"
                precision={0.5}
              />
            </Box>

            {/* Comment ------------------------------------------------------- */}
            <Box my={3}>
              <Typography variant="subtitle1" gutterBottom>
                Comments
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share your experience living with this roommate…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
              />
            </Box>

            {/* Error banner on failed submit --------------------------------- */}
            {submitted && !submitSuccess && error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {typeof error === "string" ? error : JSON.stringify(error)}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {/* Action buttons – hidden while success banner is shown */}
      {!(submitted && submitSuccess) && (
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!rating || loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {isUpdate ? "Update" : "Submit"} Feedback
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FeedbackModal;
