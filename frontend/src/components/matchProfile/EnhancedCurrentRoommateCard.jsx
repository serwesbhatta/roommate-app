import { Avatar, Button, Chip, Paper, Rating, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Card } from '@mui/material';
import { Box, Grid } from '@mui/system';
import React, { useState } from 'react';

const EnhancedCurrentRoommateCard = ({ roommate }) => {
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  const handleOpenFeedbackDialog = () => {
    setOpenFeedbackDialog(true);
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
    // Reset form values when closing without submitting
    setRating(0);
    setFeedbackText('');
  };

  const handleSubmitFeedback = () => {
    // Create new feedback object
    const newFeedback = {
      id: Date.now(),
      rating: rating,
      comment: feedbackText,
      date: new Date().toLocaleDateString()
    };

    // Add to the list of feedbacks
    setSubmittedFeedbacks([...submittedFeedbacks, newFeedback]);
    setShowFeedbacks(true);
    
    // Close the dialog
    setOpenFeedbackDialog(false);
    
    // Reset form values
    setRating(0);
    setFeedbackText('');
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={roommate.photo}
                alt={roommate.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={roommate.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({roommate.reviews})
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="h6" gutterBottom>
              {roommate.name}
              <Chip size="small" label="Current" color="success" sx={{ ml: 2 }} />
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Major</Typography>
                <Typography variant="body1">{roommate.major}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Graduation Year</Typography>
                <Typography variant="body1">{roommate.graduationYear}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Gender</Typography>
                <Typography variant="body1">{roommate.gender}</Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" size="small">View Profile</Button>
              <Button variant="outlined" size="small" sx={{ ml: 2 }}>
                Message
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                size="small" 
                sx={{ ml: 2 }}
                onClick={handleOpenFeedbackDialog}
              >
                Give Feedback
              </Button>
              {submittedFeedbacks.length > 0 && (
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }}
                  onClick={() => setShowFeedbacks(!showFeedbacks)}
                >
                  {showFeedbacks ? "Hide Feedback" : "Show Feedback"}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Feedback Display Section */}
        {showFeedbacks && submittedFeedbacks.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Your Feedback</Typography>
            
            {submittedFeedbacks.map((feedback) => (
              <Card key={feedback.id} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Rating value={feedback.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {feedback.date}
                  </Typography>
                </Box>
                <Typography variant="body2">{feedback.comment}</Typography>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Feedback Dialog */}
      <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Rate and Review Your Roommate</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" gutterBottom>How would you rate your experience?</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Share your experience"
              multiline
              rows={4}
              fullWidth
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What was your experience living with this roommate?"
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitFeedback} 
            variant="contained" 
            color="primary"
            disabled={rating === 0 || feedbackText.trim() === ''}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnhancedCurrentRoommateCard;