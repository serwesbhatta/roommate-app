import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Chip 
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
<<<<<<< HEAD
import { useSelector } from 'react-redux';

const EventCard = ({ event, onEditClick, onCancelClick }) => {
  const {id} = useSelector((state) => state.auth);
=======

const EventCard = ({ event, onEditClick, onCancelClick }) => {
>>>>>>> d315eb7 (Event integration.)
  // Format date string to more readable format
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time from ISO string
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Status chip color mapping
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
<<<<<<< HEAD
  const currentUserId = id;
  const nameLabel =
    event.requested_by === currentUserId
      ? 'You'
      : (event.requested_user_name);

=======

  // Assuming currentUserId is 1 for demo purposes
  const currentUserId = 1;
>>>>>>> d315eb7 (Event integration.)
  const isCurrentUser = event.requested_by === currentUserId || event.organizer === 'Current User';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {event.title}
          </Typography>
          <Chip 
            label={event.status} 
            size="small" 
            color={getStatusChipColor(event.status)}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            {formatDate(event.event_start || event.date)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            {event.event_start ? `${formatTime(event.event_start)} - ${formatTime(event.event_end)}` : event.time}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            {event.location}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 2 }}>
<<<<<<< HEAD
          <Chip label={`By: ${nameLabel}`} size="small" variant="outlined" />
=======
          <Chip 
            label={`By: ${event.requested_by === currentUserId ? 'You' : (event.requested_by || event.organizer)}`} 
            size="small" 
            variant="outlined" 
          />
>>>>>>> d315eb7 (Event integration.)
        </Box>
      </CardContent>
      
      <CardActions>
<<<<<<< HEAD
=======
        {event.status === 'rejected' && isCurrentUser && (
          <Button 
            size="small" 
            variant="outlined" 
            color="primary" 
            fullWidth
            onClick={() => onEditClick(event)}
          >
            Edit & Resubmit
          </Button>
        )}
>>>>>>> d315eb7 (Event integration.)
        {event.status === 'pending' && isCurrentUser && (
          <Button 
            size="small" 
            variant="outlined" 
            color="primary" 
            fullWidth
            onClick={() => onCancelClick(event.id)}
          >
            Cancel Request
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default EventCard;