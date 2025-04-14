import React from 'react';
import { Grid, Typography, Paper, Button, Box } from '@mui/material';
import EventCard from './EventCard';

const EventsList = ({ events, onEditClick, onCancelClick, onRequestClick, tabValue }) => {

  if (events.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {tabValue === 0 
            ? "No approved events found matching your filters." 
            : "You haven't submitted any event requests yet."}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={onRequestClick} 
        >
          Request an Event
        </Button>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid item xs={12} md={6} key={event.id}>
          <EventCard 
            event={event} 
            onEditClick={onEditClick} 
            onCancelClick={onCancelClick} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventsList;