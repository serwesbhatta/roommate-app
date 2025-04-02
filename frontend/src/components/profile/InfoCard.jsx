



// File: components/InfoCard.jsx
import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Divider } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const InfoCard = ({ title, children, onEdit }) => {
  return (
    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {onEdit && (
          <IconButton size="small" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Paper>
  );
};

export default InfoCard;