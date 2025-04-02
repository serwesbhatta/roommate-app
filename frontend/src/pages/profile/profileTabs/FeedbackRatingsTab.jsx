import React from 'react';
import { Box, Grid, Typography, Paper, Divider } from '@mui/material';
import {RatingDisplay, FeedbackItem} from '../../../components/profile';




// Mock data for ratings and feedback
const ratingsData = [
  { label: "Cleanliness", value: 4.5, count: 8 },
  { label: "Communication", value: 4.0, count: 8 },
  { label: "Respectfulness", value: 4.8, count: 8 },
  { label: "Reliability", value: 4.2, count: 8 },
  { label: "Quietness", value: 3.9, count: 8 },
  { label: "Overall Roommate Rating", value: 4.3, count: 8 }
];

const feedbackData = [
  {
    name: "Sarah Johnson",
    date: "January 15, 2025",
    rating: 4.5,
    comment: "John was a great roommate! He's very clean and respectful of shared spaces. He's quiet during study hours and always communicates if he's having guests over. I would definitely recommend him as a roommate."
  },
  {
    name: "Michael Chen",
    date: "December 5, 2024",
    rating: 4.0,
    comment: "Living with John was a pleasant experience. He's very organized and keeps to himself mostly. We had different schedules but he was always considerate about noise levels. The only issue was sometimes he would cook late at night."
  },
  {
    name: "Jessica Garcia",
    date: "August 30, 2024",
    rating: 5.0,
    comment: "John is the perfect roommate! Super clean, quiet, and respectful. He's also really good about paying bills on time and contributing to household supplies. We became good friends and I would room with him again in a heartbeat."
  }
];

const FeedbackRatingsTab = () => {
  return (
    <Grid container spacing={3}>
      {/* Ratings Summary */}
      <Grid item xs={12} md={4}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Roommate Ratings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box>
            {ratingsData.map(rating => (
              <RatingDisplay 
                key={rating.label}
                label={rating.label}
                value={rating.value}
                count={rating.count}
              />
            ))}
          </Box>
        </Paper>
      </Grid>
      
      {/* Feedback Comments */}
      <Grid item xs={12} md={8}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Roommate Feedback
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box>
            {feedbackData.map((feedback, index) => (
              <FeedbackItem 
                key={index}
                name={feedback.name}
                date={feedback.date}
                rating={feedback.rating}
                comment={feedback.comment}
              />
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FeedbackRatingsTab;