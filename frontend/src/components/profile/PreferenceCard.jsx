// File: components/PreferenceCard.jsx
import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Chip } from '@mui/material';

const PreferenceCard = ({ title, preferences }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {preferences.map((pref) => (
          <Box sx={{ mb: 2 }} key={pref.label}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pref.label}
            </Typography>
            <Chip 
              label={pref.value} 
              color="primary" 
              variant="outlined" 
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default PreferenceCard;