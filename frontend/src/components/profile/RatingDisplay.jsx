

// File: components/RatingDisplay.jsx
import React from 'react';
import { Box, Typography, Rating } from '@mui/material';

const RatingDisplay = ({ label, value, count }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1">{label}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Rating value={value} precision={0.5} readOnly />
        <Typography variant="body2" sx={{ ml: 1 }}>
          ({count} ratings)
        </Typography>
      </Box>
    </Box>
  );
};

export default RatingDisplay;