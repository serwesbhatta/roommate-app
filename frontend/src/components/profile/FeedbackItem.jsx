

// File: components/FeedbackItem.jsx
import React from 'react';
import { Box, Paper, Typography, Avatar, Rating, Divider } from '@mui/material';

const FeedbackItem = ({ name, date, rating, comment, avatar }) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={avatar || "/api/placeholder/40/40"} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="body2" color="text.secondary">{date}</Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Rating value={rating} precision={0.5} readOnly size="small" />
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1">{comment}</Typography>
    </Paper>
  );
};

export default FeedbackItem;