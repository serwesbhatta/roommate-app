

// File: components/InfoItem.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';

const InfoItem = ({ label, value, xs = 6 }) => {
  return (
    <Grid item xs={xs}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {value}
      </Typography>
    </Grid>
  );
};

export default InfoItem;