import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Chip, 
  Divider, 
  IconButton, 
  Tab, 
  Tabs, 
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';

const UserEvents = () => {
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for event request form dialog
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  
  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    maxAttendees: ''
  });
  
  // Filter state
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  
  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Campus Music Festival',
      description: 'Join us for a day of live music featuring student bands and performers',
      date: '2025-04-15',
      time: '18:00',
      location: 'MSU Auditorium',
      category: 'Music',
      organizer: 'Student Music Club',
      status: 'approved',
      attendees: 42,
      maxAttendees: 150
    },
    {
      id: 2,
      title: 'Computer Science Career Fair',
      description: 'Meet with recruiters from top tech companies and learn about internship opportunities',
      date: '2025-04-10',
      time: '10:00',
      location: 'Engineering Building',
      category: 'Career',
      organizer: 'CS Department',
      status: 'approved',
      attendees: 87,
      maxAttendees: 200
    },
    {
      id: 3,
      title: 'Basketball Tournament',
      description: 'Inter-department basketball competition with prizes for winners',
      date: '2025-04-22',
      time: '14:00',
      location: 'MSU Sports Complex',
      category: 'Sports',
      organizer: 'Current User',
      status: 'pending',
      attendees: 12,
      maxAttendees: 60
    },
    {
      id: 4,
      title: 'Photography Workshop',
      description: 'Learn professional photography techniques from industry experts',
      date: '2025-04-18',
      time: '13:00',
      location: 'Arts Building',
      category: 'Workshop',
      organizer: 'Current User',
      status: 'rejected',
      reason: 'Conflicting event at the same venue',
      attendees: 0,
      maxAttendees: 30
    }
  ]);
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm({
      ...eventForm,
      [name]: value
    });
  };
  
  // Submit event request
  const handleSubmitRequest = () => {
    const newEvent = {
      id: events.length + 1,
      ...eventForm,
      organizer: 'Current User',
      status: 'pending',
      attendees: 0
    };
    
    setEvents([...events, newEvent]);
    setOpenRequestDialog(false);
    // Reset form
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      maxAttendees: ''
    });
  };
  
  // Filter events based on selected filters
  const getFilteredEvents = () => {
    return events.filter(event => {
      if (filterCategory && event.category !== filterCategory) return false;
      if (filterStatus && event.status !== filterStatus) return false;
      
      // For "All Events" tab, show approved events
      if (tabValue === 0) return event.status === 'approved';
      
      // For "My Requests" tab, show user's own events
      if (tabValue === 1) return event.organizer === 'Current User';
      
      return true;
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
  
  // Format date string to more readable format
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            MSU Events
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setOpenRequestDialog(true)}
            >
              Request New Event
            </Button>
          </Box>
        </Box>
        
        {/* Tabs for different views */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Events" icon={<CalendarMonthIcon />} iconPosition="start" />
            <Tab label="My Requests" icon={<PersonIcon />} iconPosition="start" />
          </Tabs>
        </Paper>
        

        
        {/* Events grid */}
        {getFilteredEvents().length > 0 ? (
          <Grid container spacing={3}>
            {getFilteredEvents().map((event) => (
              <Grid item xs={12} md={6} key={event.id}>
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
                        {formatDate(event.date)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {event.time}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {event.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip label={event.category} size="small" sx={{ mr: 1 }} />
                      <Chip label={`By: ${event.organizer}`} size="small" variant="outlined" />
                    </Box>
                    

                  </CardContent>
                  
                  <CardActions>
                    {event.status === 'rejected' && event.organizer === 'Current User' && (
                      <Button size="small" variant="outlined" color="primary" fullWidth>
                        Edit & Resubmit
                      </Button>
                    )}
                    {event.status === 'pending' && event.organizer === 'Current User' && (
                      <Button size="small" variant="outlined" color="primary" fullWidth>
                        Cancel Request
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {tabValue === 0 
                ? "No approved events found matching your filters." 
                : "You haven't submitted any event requests yet."}
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => setOpenRequestDialog(true)} 
            >
              Request an Event
            </Button>
          </Paper>
        )}
      </Box>
      
      {/* Event Request Dialog */}
      <Dialog 
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Request Event at MSU</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Event Title"
                fullWidth
                value={eventForm.title}
                onChange={handleFormChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Event Description"
                multiline
                rows={4}
                fullWidth
                value={eventForm.description}
                onChange={handleFormChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Event Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={eventForm.date}
                onChange={handleFormChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="time"
                label="Event Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={eventForm.time}
                onChange={handleFormChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Event Location"
                fullWidth
                value={eventForm.location}
                onChange={handleFormChange}
                required
                helperText="Specify the exact location on MSU campus"
              />
            </Grid>
            
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitRequest}
            disabled={!eventForm.title || !eventForm.date || !eventForm.location}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserEvents;